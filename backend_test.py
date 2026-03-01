#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, timedelta
import os
from pathlib import Path

class FreemanCleaningAPITester:
    def __init__(self, base_url="https://freeman-mobile.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            if success and "FREEMAN MOBILE CLEANING API" in data.get("message", ""):
                self.log_test("API Root Endpoint", True)
                return True
            else:
                self.log_test("API Root Endpoint", False, f"Status: {response.status_code}, Response: {data}")
                return False
        except Exception as e:
            self.log_test("API Root Endpoint", False, str(e))
            return False

    def test_get_services(self):
        """Test getting all services"""
        try:
            response = requests.get(f"{self.api_url}/services", timeout=10)
            success = response.status_code == 200
            
            if success:
                services = response.json()
                if len(services) == 21:
                    # Check if all required services are present
                    service_names = [s.get('name', '') for s in services]
                    required_services = [
                        "Mobile CarWash", "CarWash", "LandScaping", "Laundry", "Home Cleaning",
                        "Office Cleaning", "Lawn Care", "Garbage Collection", "Smart Home Repair",
                        "Environment Cleaning", "Farm Work", "Garden Work", "Toilet Cleaning",
                        "Yard Cleaning", "Guest House Cleaning", "Hotel Cleaning", "Building Cleaning",
                        "Carpet Cleaning", "Sofa Cleaning", "Mattress Cleaning", "Car Engine Cleaning"
                    ]
                    
                    missing_services = [s for s in required_services if s not in service_names]
                    if not missing_services:
                        self.log_test("Get All Services (21 services)", True)
                        return True, services
                    else:
                        self.log_test("Get All Services", False, f"Missing services: {missing_services}")
                        return False, []
                else:
                    self.log_test("Get All Services", False, f"Expected 21 services, got {len(services)}")
                    return False, []
            else:
                self.log_test("Get All Services", False, f"Status: {response.status_code}")
                return False, []
        except Exception as e:
            self.log_test("Get All Services", False, str(e))
            return False, []

    def test_get_single_service(self, services):
        """Test getting a single service by ID"""
        if not services:
            self.log_test("Get Single Service", False, "No services available to test")
            return False
            
        try:
            # Test with first service
            service_id = services[0].get('id')
            response = requests.get(f"{self.api_url}/services/{service_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                service = response.json()
                if service.get('id') == service_id:
                    self.log_test("Get Single Service", True)
                    return True
                else:
                    self.log_test("Get Single Service", False, "Service ID mismatch")
                    return False
            else:
                self.log_test("Get Single Service", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Single Service", False, str(e))
            return False

    def test_get_time_slots(self):
        """Test getting time slots for a date"""
        try:
            # Test with tomorrow's date
            tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
            response = requests.get(f"{self.api_url}/time-slots?date={tomorrow}", timeout=10)
            success = response.status_code == 200
            
            if success:
                slots = response.json()
                expected_times = [
                    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
                    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
                    "04:00 PM", "05:00 PM", "06:00 PM"
                ]
                
                if len(slots) == len(expected_times):
                    # Check if all slots have required fields
                    valid_slots = all(
                        'time' in slot and 'available' in slot 
                        for slot in slots
                    )
                    if valid_slots:
                        self.log_test("Get Time Slots", True)
                        return True, slots
                    else:
                        self.log_test("Get Time Slots", False, "Invalid slot format")
                        return False, []
                else:
                    self.log_test("Get Time Slots", False, f"Expected {len(expected_times)} slots, got {len(slots)}")
                    return False, []
            else:
                self.log_test("Get Time Slots", False, f"Status: {response.status_code}")
                return False, []
        except Exception as e:
            self.log_test("Get Time Slots", False, str(e))
            return False, []

    def test_upload_photo(self):
        """Test photo upload endpoint"""
        try:
            # Create a simple test image file
            test_image_content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc\xf8\x00\x00\x00\x01\x00\x01\x00\x00\x00\x00IEND\xaeB`\x82'
            
            files = {'file': ('test.png', test_image_content, 'image/png')}
            response = requests.post(f"{self.api_url}/upload-photo", files=files, timeout=15)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if 'filename' in data and 'message' in data:
                    self.log_test("Photo Upload", True)
                    return True, data.get('filename')
                else:
                    self.log_test("Photo Upload", False, "Missing filename or message in response")
                    return False, None
            else:
                self.log_test("Photo Upload", False, f"Status: {response.status_code}")
                return False, None
        except Exception as e:
            self.log_test("Photo Upload", False, str(e))
            return False, None

    def test_create_booking(self, services, uploaded_filename=None):
        """Test creating a booking"""
        if not services:
            self.log_test("Create Booking", False, "No services available")
            return False, None
            
        try:
            # Use first service for booking
            service = services[0]
            tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
            
            booking_data = {
                "service_id": service['id'],
                "service_name": service['name'],
                "date": tomorrow,
                "time_slot": "10:00 AM",
                "customer_name": "Test Customer",
                "customer_phone": "+1234567890",
                "customer_email": "test@example.com",
                "customer_address": "123 Test Street, Test City",
                "notes": "Test booking for API testing",
                "photo_filename": uploaded_filename
            }
            
            response = requests.post(
                f"{self.api_url}/bookings", 
                json=booking_data,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            success = response.status_code == 200
            
            if success:
                booking = response.json()
                if booking.get('id') and booking.get('service_name') == service['name']:
                    self.log_test("Create Booking", True)
                    return True, booking
                else:
                    self.log_test("Create Booking", False, "Invalid booking response")
                    return False, None
            else:
                self.log_test("Create Booking", False, f"Status: {response.status_code}, Response: {response.text}")
                return False, None
        except Exception as e:
            self.log_test("Create Booking", False, str(e))
            return False, None

    def test_get_bookings(self):
        """Test getting all bookings"""
        try:
            response = requests.get(f"{self.api_url}/bookings", timeout=10)
            success = response.status_code == 200
            
            if success:
                bookings = response.json()
                self.log_test("Get All Bookings", True, f"Found {len(bookings)} bookings")
                return True, bookings
            else:
                self.log_test("Get All Bookings", False, f"Status: {response.status_code}")
                return False, []
        except Exception as e:
            self.log_test("Get All Bookings", False, str(e))
            return False, []

    def test_get_single_booking(self, booking_id):
        """Test getting a single booking by ID"""
        if not booking_id:
            self.log_test("Get Single Booking", False, "No booking ID provided")
            return False
            
        try:
            response = requests.get(f"{self.api_url}/bookings/{booking_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                booking = response.json()
                if booking.get('id') == booking_id:
                    self.log_test("Get Single Booking", True)
                    return True
                else:
                    self.log_test("Get Single Booking", False, "Booking ID mismatch")
                    return False
            else:
                self.log_test("Get Single Booking", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Single Booking", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🧪 Starting Freeman Mobile Cleaning API Tests...")
        print(f"🌐 Testing API at: {self.api_url}")
        print("=" * 60)
        
        # Test API root
        if not self.test_api_root():
            print("❌ API root test failed - stopping tests")
            return self.generate_report()
        
        # Test services
        services_success, services = self.test_get_services()
        if services_success:
            self.test_get_single_service(services)
        
        # Test time slots
        slots_success, slots = self.test_get_time_slots()
        
        # Test photo upload
        upload_success, filename = self.test_upload_photo()
        
        # Test booking creation
        booking_success, booking = self.test_create_booking(services, filename if upload_success else None)
        
        # Test booking retrieval
        self.test_get_bookings()
        if booking_success and booking:
            self.test_get_single_booking(booking.get('id'))
        
        return self.generate_report()

    def generate_report(self):
        """Generate test report"""
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"📈 Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.tests_passed < self.tests_run:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  • {result['test']}: {result['details']}")
        
        return {
            'total_tests': self.tests_run,
            'passed_tests': self.tests_passed,
            'success_rate': self.tests_passed/self.tests_run*100 if self.tests_run > 0 else 0,
            'test_results': self.test_results
        }

def main():
    """Main test execution"""
    tester = FreemanCleaningAPITester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if results['passed_tests'] == results['total_tests'] else 1

if __name__ == "__main__":
    sys.exit(main())