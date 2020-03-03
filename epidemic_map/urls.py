from django.contrib import admin
from django.urls import path,re_path,include
from epidemic_map import views
app_name='[epidemic1]'
urlpatterns = [
    re_path(r'index$',views.index),
    re_path(r'get_map_data$',views.get_map_data),
    re_path(r'get_ncov_totalcount$',views.get_ncov_totalcount),
    re_path(r'get_everyday_data$',views.get_everyday_data)


]
