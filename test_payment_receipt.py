import os
from django.test import TestCase, Client
from django.urls import reverse
from attariq.models import Payment, Enrollment, Student
from django.conf import settings

class PaymentReceiptTest(TestCase):
    def setUp(self):
        # Create test student, enrollment, and payment
        self.student = Student.objects.create(full_name="Test Student", email="test@example.com")
        self.enrollment = Enrollment.objects.create(student=self.student, status="pending")
        self.payment = Payment.objects.create(enrollment=self.enrollment, amount=100.0, reference="TESTREF123", status="success")

        self.client = Client()

    def test_payment_receipt_pdf_generation(self):
        url = reverse('payment_receipt_pdf', args=[self.payment.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertIn('attachment; filename="payment_receipt_', response['Content-Disposition'])

    def test_payment_success_receipt_file_generation(self):
        # Call the payment_success view which generates and serves the PDF file
        url = reverse('payment_success', args=[self.payment.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/pdf')

        # Check if the receipt file was created in the receipts directory
        receipts_dir = os.path.join(settings.BASE_DIR, 'tmsp', 'receipts')
        receipt_path = os.path.join(receipts_dir, f'payment_receipt_{self.payment.id}.pdf')
        self.assertTrue(os.path.exists(receipt_path))

        # Clean up the generated file after test
        if os.path.exists(receipt_path):
            os.remove(receipt_path)
