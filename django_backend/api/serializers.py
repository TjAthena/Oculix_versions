from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Client, Report

class ClientSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = Client
        fields = ['id', 'company_name', 'username', 'password', 'created_by', 'created_at', 'client_profile_id']
        read_only_fields = ['id', 'created_by', 'created_at']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'name', 'client', 'power_bi_embed_url', 'type', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
