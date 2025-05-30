from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    subscription_expiry = serializers.SerializerMethodField()

    def get_name(self, obj):
        first_name = obj.first_name or ''
        last_name = obj.last_name or ''
        full_name = f"{first_name} {last_name}".strip()
        return full_name if full_name else None
    
    def get_subscription_expiry(self, obj):
        try:
            return obj.subscription_expiry
        except:
            return None

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'company_name', 
                 'business_type', 'subscription', 'subscription_expiry', 'created_at', 'status', 'name']
        read_only_fields = ['id', 'created_at', 'name']

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'phone_number', 
                 'business_type', 'company_name', 'role']
    
    def create(self, validated_data):
        validated_data['role'] = 'core_user'  # Set default role
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
