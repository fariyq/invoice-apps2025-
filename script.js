document.addEventListener("DOMContentLoaded", function () {
    let invoiceBody = document.getElementById("invoiceBody");
    let grandTotalElement = document.getElementById("grandTotal");
    let paidAmountElement = document.getElementById("paidAmount");
    let dueAmountElement = document.getElementById("dueAmount");
    let returnAmountElement = document.getElementById("returnAmount");
    let paymentStatusElement = document.getElementById("paymentStatus");
    let invoiceNumberElement = document.getElementById("invoiceNumber");

    function generateInvoiceNumber() {
        let randomNumber = Math.floor(100000 + Math.random() * 900000);
        invoiceNumberElement.value = "INV-" + randomNumber; 
    }

    function updateDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString('bn-BD');
        const time = now.toLocaleTimeString('bn-BD');

        document.getElementById('currentDate').innerText = date;
        document.getElementById('currentTime').innerText = time;
    }

    function calculateTotal() {
        let rows = document.querySelectorAll("#invoiceBody tr");
        let grandTotal = 0;

        rows.forEach(row => {
            let quantity = parseFloat(row.querySelector(".quantity").value) || 0;
            let unitPrice = parseFloat(row.querySelector(".unitPrice").value) || 0;
            let totalPrice = quantity * unitPrice;
            row.querySelector(".totalPrice").innerText = totalPrice.toFixed(2) + " টাকা";
            grandTotal += totalPrice;
        });

        grandTotalElement.innerText = grandTotal.toFixed(2) + " টাকা";
        calculateDue();
        updateSerialNumbers();
    }

    window.calculateDue = function () {
        let grandTotal = parseFloat(grandTotalElement.innerText.replace(" টাকা", "")) || 0;
        let paidAmount = parseFloat(paidAmountElement.value) || 0;
        let dueAmount = grandTotal - paidAmount;
        let returnAmount = dueAmount < 0 ? Math.abs(dueAmount) : 0;
        dueAmount = dueAmount > 0 ? dueAmount : 0;

        dueAmountElement.innerText = dueAmount.toFixed(2) + " টাকা";
        returnAmountElement.innerText = returnAmount.toFixed(2) + " টাকা";
        paymentStatusElement.style.display = dueAmount === 0 && paidAmount > 0 ? "block" : "none";
    };

    function updateSerialNumbers() {
        let rows = document.querySelectorAll("#invoiceBody tr");
        rows.forEach((row, index) => {
            row.querySelector(".serialNumber").innerText = index + 1;
        });
    }

    window.addItem = function() {
        let row = document.createElement("tr");
        row.innerHTML = `<td class="serialNumber"></td>
                         <td><input type="text" class="productName"></td>
                         <td><input type="number" class="quantity" min="0"></td>
                         <td><input type="number" class="unitPrice" min="0"></td>
                         <td class="totalPrice">0 টাকা</td>
                         <td class="no-print"><button class="removeBtn">❌</button></td>`;

        row.querySelector(".quantity").addEventListener("input", calculateTotal);
        row.querySelector(".unitPrice").addEventListener("input", calculateTotal);
        row.querySelector(".removeBtn").addEventListener("click", function () {
            row.remove();
            calculateTotal();
        });

        invoiceBody.appendChild(row);
        updateSerialNumbers();
    };

    window.printInvoice = function() {
        window.print();
    };

    generateInvoiceNumber();
    updateDateTime();
});