from django.contrib import admin
from .models import Brand, Car, UserProfile, Favorite

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ['brand', 'model', 'year', 'body_type', 'is_available']
    list_filter = ['brand', 'body_type', 'transmission', 'is_available']
    search_fields = ['model', 'brand__name']

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name']

admin.site.register(UserProfile)
admin.site.register(Favorite)

# Register your models here.
