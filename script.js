document.addEventListener('DOMContentLoaded', function () {
    // --- ELEMENTS ---
    const orderForm = document.getElementById('orderForm');
    const foodItems = document.querySelectorAll('.food-item');
    const quantityInputs = document.querySelectorAll('.quantity-selector input');
    const categoryItems = document.querySelectorAll('.category-item');
    const foodSearch = document.getElementById('foodSearch');
    const backToTopButton = document.getElementById('backToTop');
    const qrContainer = document.getElementById('qrContainer');
    const paymentRadios = document.querySelectorAll('input[name="entry.2129779347"]');

    // --- DATA ---
    const productData = {
        'quantity-bunchaca': { price: 25000, name: 'Bún Chả Cá' },
        'quantity-buncharieu': { price: 30000, name: 'Bún Chả Riêu' },
        'quantity-chaca': { price: 20000, name: 'Chả cá riêng' },
        'quantity-bunthem': { price: 5000, name: 'Bún thêm' }
    };

    // --- FUNCTIONS ---
    /**
     * Formats a number as Vietnamese currency.
     * @param {number} number - The number to format.
     * @returns {string} - The formatted currency string.
     */
    function formatCurrency(number) {
        return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    /**
     * Updates the order summary table based on current quantities.
     */
    function updateOrderSummary() {
        const orderTableBody = document.querySelector('#orderTable tbody');
        orderTableBody.innerHTML = '';
        let totalPrice = 0;

        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value, 10) || 0;
            if (quantity > 0) {
                const productInfo = productData[input.id];
                const itemTotalPrice = productInfo.price * quantity;
                totalPrice += itemTotalPrice;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${productInfo.name}</td>
                    <td style="text-align: center;">${quantity}</td>
                    <td style="text-align: right;">${formatCurrency(productInfo.price)}</td>
                    <td style="text-align: right;">${formatCurrency(itemTotalPrice)}</td>
                `;
                orderTableBody.appendChild(row);
            }
        });

        document.getElementById('totalPrice').textContent = formatCurrency(totalPrice);
        updateQRCode(totalPrice);
    }

    /**
     * Generates a random 6-character order ID.
     * @returns {string} - The generated order ID.
     */
    function generateOrderId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let orderId = '';
        for (let i = 0; i < 6; i++) {
            orderId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return orderId;
    }
    
    const orderId = generateOrderId();

    /**
     * Updates the VietQR code image based on the total amount.
     * @param {number} totalAmount - The total order amount.
     */
    function updateQRCode(totalAmount) {
        if (totalAmount > 0 && document.querySelector('input[name="entry.2129779347"][value="Chuyển khoản"]').checked) {
            const qrCodeImg = document.getElementById('qrCode');
            const accountName = "Nguyen Thai Hoan";
            const accountNumber = "HOANIT";
            const bankCode = "VCB";
            const description = `Thanh toan don hang ${orderId}`;
            const apiUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.jpg?amount=${totalAmount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
            
            qrCodeImg.src = apiUrl;
            qrContainer.style.display = 'block';
        } else {
            qrContainer.style.display = 'none';
        }
    }

    /**
     * Removes diacritics from a Vietnamese string for searching.
     * @param {string} str - The string to normalize.
     * @returns {string} - The normalized string.
     */
    function removeVietnameseTones(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    }

    /**
     * Filters food items based on the search term.
     */
    function filterFoodItems() {
        const searchTerm = removeVietnameseTones(foodSearch.value.trim().toLowerCase());
        foodItems.forEach(item => {
            const foodName = removeVietnameseTones(item.querySelector('h3').textContent.trim().toLowerCase());
            if (foodName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    /**
     * Filters food items based on the selected category.
     * @param {string} selectedCategory - The category to display.
     */
    function filterByCategory(selectedCategory) {
        foodItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    /**
     * Displays the order success popup.
     */
    function showPopup() {
        document.getElementById('popupOverlay').style.display = 'flex';
    }

    /**
     * Closes the order success popup and reloads the page.
     */
    window.closePopup = function() {
        document.getElementById('popupOverlay').style.display = 'none';
        location.reload();
    };


    // --- EVENT LISTENERS ---

    // Update summary when quantity changes
    quantityInputs.forEach(input => {
        input.addEventListener('input', updateOrderSummary);
    });

    // Handle form submission
    orderForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Always prevent default submission first

        // 1. Validate cart is not empty
        const totalQuantity = Array.from(quantityInputs).reduce((sum, input) => sum + (parseInt(input.value, 10) || 0), 0);
        if (totalQuantity === 0) {
            alert("Giỏ hàng của bạn đang trống. Vui lòng chọn ít nhất một món ăn.");
            return;
        }

        // 2. Validate shipping information
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const address = document.getElementById('customerAddress').value.trim();
        if (!name || !phone || !address) {
            alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ.");
            return;
        }

        // 3. Validate payment method selection
        const selectedPaymentMethod = document.querySelector('input[name="entry.2129779347"]:checked');
        if (!selectedPaymentMethod) {
            alert("Vui lòng chọn phương thức thanh toán.");
            return;
        }

        // If all validations pass, show success popup and submit the form.
        showPopup();
        
        // Timeout allows the user to see the popup before the form submits in the background.
        setTimeout(() => {
             orderForm.submit();
        }, 500);
    });

    // Handle category filtering
    categoryItems.forEach(item => {
        item.addEventListener('click', function () {
            categoryItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const selectedCategory = this.getAttribute('data-category');
            filterByCategory(selectedCategory);
        });
    });

    // Handle search input
    foodSearch.addEventListener('input', filterFoodItems);

    // Show/hide QR code based on payment method
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', updateOrderSummary);
    });

    // Back to top button visibility and functionality
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    backToTopButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- INITIALIZATION ---
    document.getElementById('orderIdDisplay').textContent = `Mã đơn hàng: #${orderId}`;
    updateOrderSummary();
});
