from django.urls import path
from . import views

urlpatterns = [
    path("employees/", views.get_employees),
    path("employees/create/", views.create_employee),
    path("employees/delete/<int:id>/", views.delete_employee),

    path("attendance/", views.get_attendance),
    path("attendance/mark/", views.mark_attendance),
]
