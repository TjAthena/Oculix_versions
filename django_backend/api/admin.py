from django.contrib import admin
from .models import Client, Report

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'username', 'created_by', 'created_at')
    search_fields = ('company_name', 'username')
    list_filter = ('created_at',)

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('name', 'client', 'type', 'created_by', 'created_at')
    search_fields = ('name',)
    list_filter = ('type', 'created_at')