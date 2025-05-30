from django.db import models
import uuid
from django.conf import settings

class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_name = models.CharField(max_length=255)
    username = models.CharField(max_length=100, unique=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, 
                                  related_name='created_clients')
    created_at = models.DateTimeField(auto_now_add=True)
    client_profile_id = models.UUIDField(blank=True, null=True)
    
    def __str__(self):
        return self.company_name

class Report(models.Model):
    REPORT_TYPES = [
        ('Dashboard', 'Dashboard'),
        ('Report', 'Report'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='reports')
    power_bi_embed_url = models.URLField(max_length=1000)
    type = models.CharField(max_length=20, choices=REPORT_TYPES, default='Report')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, 
                                  related_name='created_reports')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name