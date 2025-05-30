from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ReportViewSet, UserCountViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'reports', ReportViewSet)
router.register(r'user-counts', UserCountViewSet, basename='user-counts')

urlpatterns = [
    path('', include(router.urls)),
]
