from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer


# Employee APIs
@api_view(["GET"])
def get_employees(request):
    employees = Employee.objects.all().order_by("-created_at")
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def create_employee(request):
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_employee(request, id):
    try:
        emp = Employee.objects.get(id=id)
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found"}, status=404)

    emp.delete()
    return Response({"message": "Employee deleted"})


# Attendance APIs
@api_view(["POST"])
def mark_attendance(request):
    serializer = AttendanceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(["GET"])
def get_attendance(request):
    employee_id = request.GET.get("employee")
    date = request.GET.get("date")

    queryset = Attendance.objects.all()

    if employee_id:
        queryset = queryset.filter(employee_id=employee_id)

    if date:
        queryset = queryset.filter(date=date)

    serializer = AttendanceSerializer(queryset, many=True)
    return Response(serializer.data)
