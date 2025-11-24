from django.template.loader import render_to_string
from xhtml2pdf import pisa
from django.core.files.base import ContentFile
import io


def generate_invoice_pdf(invoice):
    if invoice.pdf_file:
        return invoice.pdf_file.url
    html = render_to_string("invoices/paid_invoice_template.html", {"invoice": invoice})
    result = io.BytesIO()
    pdf = pisa.pisaDocument(io.BytesIO(html.encode("UTF-8")), dest=result)
    if not pdf.err:
        invoice.pdf_file.save(
            f"Invoice_{invoice.invoice_number}.pdf", ContentFile(result.getvalue())
        )
        invoice.save()
    return invoice.pdf_file.url if invoice.pdf_file else None
