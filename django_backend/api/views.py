from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Client, Report
from .serializers import ClientSerializer, ReportSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

User = get_user_model()

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to view/edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.role == 'admin':
            return True

        # Core users can see their own created objects
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user

        return False

class UserCountViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def list(self, request):
        total_users = User.objects.count()
        core_users = User.objects.filter(role='core_user').count()
        client_users = User.objects.filter(role='client').count()

        return Response({
            'total_users': total_users,
            'core_users': core_users,
            'client_users': client_users
        })

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Client.objects.all()
        elif user.role == 'core_user':
            return Client.objects.filter(created_by=user)
        elif user.role == 'client' and hasattr(user, 'id'):
            # Clients can only see their own client record
            return Client.objects.filter(client_profile_id=user.id)
        return Client.objects.none()
    
    def perform_create(self, serializer):
        from django.contrib.auth import get_user_model
        from django.contrib.auth.hashers import make_password

        User = get_user_model()

        # Hash the password
        password = serializer.validated_data.pop('password')
        hashed_password = make_password(password)

        # Create the client
        client = serializer.save(created_by=self.request.user)

        # Create a new user for the client
        User.objects.create_user(
            username=serializer.validated_data['username'],
            password=hashed_password,
            role='client',
            client_profile_id=client.id,
        )
    
    @action(detail=True, methods=['get'])
    def report_count(self, request, pk=None):
        client = self.get_object()
        count = Report.objects.filter(client=client).count()
        return Response({'count': count})

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        client_id = self.request.query_params.get('client_id')
        
        queryset = Report.objects.all()
        
        if user.role == 'admin':
            pass  # Return all reports
        elif user.role == 'core_user':
            queryset = queryset.filter(created_by=user)
        elif user.role == 'client' and hasattr(user, 'id'):
            # Clients can only see reports associated with their client record
            try:
                client = Client.objects.get(client_profile_id=user.id)
                queryset = queryset.filter(client=client)
            except Client.DoesNotExist:
                return Report.objects.none()
        else:
            return Report.objects.none()
        
        if client_id:
            queryset = queryset.filter(client__id=client_id)
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
