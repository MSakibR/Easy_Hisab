"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useRouter } from "next/navigation";
import html2pdf from "html2pdf.js";
import { useState } from "react";

<div id="invoiceDocument">
  <div className="paid-stamp">PAID</div>

  <h1>{invoice.customer.company_name}</h1>
  <p>{invoice.customer.contact_person}</p>
  <p>Invoice Number: {invoice.invoice_number}</p>
  <p>Total: ৳{invoice.total_amount}</p>
  <p>Payment Method: {invoice.payment_method}</p>

  {invoice.items.map((item) => (
    <div key={item.id}>
      <span>{item.product.name}</span>
      <span>{item.quantity}</span>
      <span>৳{item.total}</span>
    </div>
  ))}

  <button onClick={() => generatePDF()}>Download PDF</button>
</div>;
