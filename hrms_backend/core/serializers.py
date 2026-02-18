from rest_framework import serializers
from .models import Employee, Attendance

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"

    def validate_employee_id(self, value):
        if Employee.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("Employee ID already exists")
        return value


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.full_name", read_only=True)

    class Meta:
        model = Attendance
        fields = "__all__"
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=Attendance.objects.all(),
                fields=["employee", "date"],
                message="Attendance already marked for this date"
            )
        ]
