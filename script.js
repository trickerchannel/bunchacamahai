document.addEventListener('DOMContentLoaded', function () {
    // --- TĂNG CƯỜNG BẢO MẬT ---

    // Chống F12, Ctrl+U, Ctrl+Shift+J
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'J') || 
            (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
            alert("Chức năng này đã bị vô hiệu hóa.");
        }
    });
    
    // Chống gỡ lỗi (debugger)
    function checkDebugger() {
        const startTime = new Date().getTime();
        debugger;
        const endTime = new Date().getTime();
        if (endTime - startTime > 100) {
            alert("Phát hiện công cụ gỡ lỗi. Vui lòng đóng lại.");
            // Tùy chọn: Chuyển hướng hoặc chặn nội dung
            // window.location.href = "about:blank"; 
        }
    }

    // Chạy kiểm tra gỡ lỗi định kỳ
    // setInterval(checkDebugger, 1000); // Bỏ ghi chú để bật kiểm tra định kỳ

    // --- CÁC THÀNH PHẦN GIAO DIỆN (ELEMENTS) ---
    const orderForm = document.getElementById('orderForm');
    const foodItems = document.querySelectorAll('.food-item');
    const quantityInputs = document.querySelectorAll('.quantity-selector input');
    const categoryItems = document.querySelectorAll('.category-item');
    const foodSearch = document.getElementById('foodSearch');
    const backToTopButton = document.getElementById('backToTop');
    const qrContainer = document.getElementById('qrContainer');
    const paymentRadios = document.querySelectorAll('input[name="entry.2129779347"]');
    const customerNameInput = document.getElementById('customerName');
    const customerPhoneInput = document.getElementById('customerPhone');
    const customerAddressInput = document.getElementById('customerAddress');


    // --- DỮ LIỆU SẢN PHẨM ---
    const productData = {
        'quantity-bunchaca': { price: 25000, name: 'Bún Chả Cá' },
        'quantity-buncharieu': { price: 30000, name: 'Bún Chả Riêu' },
        'quantity-chaca': { price: 20000, name: 'Chả cá riêng' },
        'quantity-bunthem': { price: 5000, name: 'Bún thêm' },
        'quantity-huda': { price: 25000, name: 'Bia Huda' },
        'quantity-coca': { price: 20000, name: 'Cocacola' }
    };

    // --- CÁC HÀM XỬ LÝ ---
    
    /**
     * Tạo và hiển thị thông báo lỗi cho một trường nhập liệu.
     * @param {HTMLElement} element - Trường nhập liệu cần hiển thị lỗi.
     * @param {string} message - Thông báo lỗi cần hiển thị.
     */
    function showError(element, message) {
        // Sử dụng parentNode để đảm bảo hoạt động đúng với textarea
        const parent = element.parentNode;
        let error = parent.querySelector('.error-message');
        if (!error) {
            error = document.createElement('span');
            error.className = 'error-message';
            error.style.color = 'red';
            error.style.fontSize = '0.9em';
            // Chèn lỗi sau thẻ input/textarea
            parent.insertBefore(error, element.nextSibling);
        }
        error.textContent = message;
    }

    /**
     * Xóa thông báo lỗi của một trường nhập liệu.
     * @param {HTMLElement} element - Trường nhập liệu cần xóa lỗi.
     */
    function clearError(element) {
        const parent = element.parentNode;
        let error = parent.querySelector('.error-message');
        if (error) {
            error.textContent = '';
        }
    }


    /**
     * Định dạng một số thành đơn vị tiền tệ Việt Nam.
     * @param {number} number - Con số cần định dạng.
     * @returns {string} - Chuỗi tiền tệ đã được định dạng.
     */
    function formatCurrency(number) {
        return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    /**
     * Cập nhật bảng tóm tắt đơn hàng dựa trên số lượng hiện tại.
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
     * Tạo một mã đơn hàng ngẫu nhiên gồm 6 ký tự.
     * @returns {string} - Mã đơn hàng đã tạo.
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
     * Cập nhật hình ảnh mã VietQR dựa trên tổng số tiền.
     * @param {number} totalAmount - Tổng tiền của đơn hàng.
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
     * Loại bỏ dấu tiếng Việt khỏi một chuỗi để tìm kiếm.
     * @param {string} str - Chuỗi cần chuẩn hóa.
     * @returns {string} - Chuỗi đã được chuẩn hóa.
     */
    function removeVietnameseTones(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    }

    /**
     * [FIXED] Lọc các món ăn dựa trên TỪ KHÓA TÌM KIẾM và DANH MỤC đang chọn.
     */
    function applyFilters() {
        const searchTerm = removeVietnameseTones(foodSearch.value.trim().toLowerCase());
        const activeCategory = document.querySelector('.category-item.active').getAttribute('data-category');

        foodItems.forEach(item => {
            const foodName = removeVietnameseTones(item.querySelector('h3').textContent.trim().toLowerCase());
            const itemCategory = item.getAttribute('data-category');

            const categoryMatch = (activeCategory === 'all' || itemCategory === activeCategory);
            const searchMatch = foodName.includes(searchTerm);

            if (categoryMatch && searchMatch) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    /**
     * Hiển thị popup thông báo đặt hàng thành công.
     */
    function showPopup() {
        document.getElementById('popupOverlay').style.display = 'flex';
    }

    /**
     * Đóng popup và tải lại trang.
     */
    window.closePopup = function() {
        document.getElementById('popupOverlay').style.display = 'none';
        location.reload();
    };

    // --- CÁC BỘ LẮNG NGHE SỰ KIỆN ---

    // Xác thực ô nhập số lượng chỉ cho phép nhập số
    quantityInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            updateOrderSummary();
        });
    });

    // Xác thực tên khách hàng (không chứa số và ký tự đặc biệt)
    customerNameInput.addEventListener('input', function() {
        const invalidChars = /[\d!@#$%^&*()]/g;
        const originalValue = this.value;
        const sanitizedValue = originalValue.replace(invalidChars, '');

        if (originalValue !== sanitizedValue) {
            showError(this, "Họ và tên không được chứa số hoặc ký tự đặc biệt.");
            this.value = sanitizedValue;
        } else {
            clearError(this);
        }
    });

    // Xác thực số điện thoại chỉ cho phép nhập số và tối đa 10 chữ số
    customerPhoneInput.addEventListener('input', function() {
        const originalValue = this.value;
        const numericValue = originalValue.replace(/[^0-9]/g, '');

        if (originalValue !== numericValue) {
             showError(this, "Số điện thoại chỉ được nhập số.");
        } else if (numericValue.length > 10) {
             showError(this, "Số điện thoại không được quá 10 số.");
        }
        else {
            clearError(this);
        }
        
        // Ép buộc độ dài tối đa
        this.value = numericValue.slice(0, 10); 
    });
    
    // Xác thực địa chỉ (không chứa ký tự đặc biệt và phải có chữ + số)
    customerAddressInput.addEventListener('input', function() {
        const invalidSpecialChars = /[!@#$%^&*()]/g;
        let value = this.value;
        
        // 1. Loại bỏ ký tự đặc biệt
        if (invalidSpecialChars.test(value)) {
            value = value.replace(invalidSpecialChars, '');
            this.value = value;
            showError(this, "Địa chỉ không được chứa các ký tự đặc biệt: !@#$%^&*()");
            return; // Dừng lại sau khi hiển thị lỗi này
        }

        // 2. Kiểm tra phải có cả chữ và số
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /\d/.test(value);

        if (value.trim() && (!hasLetter || !hasNumber)) {
            showError(this, "Địa chỉ phải bao gồm số nhà và tên đường.");
        } else {
            clearError(this); // Xóa lỗi nếu cả hai điều kiện đều ổn
        }
    });

    // Xử lý việc gửi form
    orderForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Luôn chặn hành vi mặc định của form

        // 1. Xác thực giỏ hàng không được trống
        const totalQuantity = Array.from(quantityInputs).reduce((sum, input) => sum + (parseInt(input.value, 10) || 0), 0);
        if (totalQuantity === 0) {
            alert("Giỏ hàng của bạn đang trống. Vui lòng chọn ít nhất một món ăn.");
            return;
        }

        // 2. Xác thực thông tin giao hàng
        const name = customerNameInput.value.trim();
        const phone = customerPhoneInput.value.trim();
        const address = customerAddressInput.value.trim();
        if (!name || !phone || !address) {
            alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ.");
            return;
        }
        
        // Kiểm tra bổ sung cho các ký tự không hợp lệ phòng trường hợp người dùng copy-paste
        if (/\d/.test(name)) {
            alert("Họ và tên không hợp lệ.");
            showError(customerNameInput, "Họ và tên không được chứa số.");
            return;
        }
        
        if (/[^0-9]/.test(phone)) {
            alert("Số điện thoại không hợp lệ.");
             showError(customerPhoneInput, "Số điện thoại chỉ được nhập số.");
            return;
        }

        // Xác thực lại địa chỉ khi gửi form
        const hasLetter = /[a-zA-Z]/.test(address);
        const hasNumber = /\d/.test(address);
        if (!hasLetter || !hasNumber) {
            alert("Địa chỉ không hợp lệ. Vui lòng kiểm tra lại.");
            showError(customerAddressInput, "Định dạng địa chỉ không hợp lệ, phải có cả chữ và số.");
            return;
        }


        // 3. Xác thực phương thức thanh toán đã được chọn
        const selectedPaymentMethod = document.querySelector('input[name="entry.2129779347"]:checked');
        if (!selectedPaymentMethod) {
            alert("Vui lòng chọn phương thức thanh toán.");
            return;
        }

        // Nếu tất cả xác thực đều hợp lệ, hiển thị popup và gửi form
        showPopup();
        
        // Thời gian chờ cho phép người dùng thấy popup trước khi form thực sự được gửi đi
        setTimeout(() => {
             // Trong kịch bản thực tế, bạn có thể dùng AJAX để tránh mở tab mới
             // Với form này, chúng ta gửi đi như hiện tại.
             orderForm.submit();
        }, 500);
    });

    // [FIXED] Xử lý lọc theo danh mục
    categoryItems.forEach(item => {
        item.addEventListener('click', function () {
            categoryItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });

    // [FIXED] Xử lý ô tìm kiếm khi nhập liệu
    foodSearch.addEventListener('input', applyFilters);

    // [NEW] Xử lý ô tìm kiếm khi nhấn Enter
    foodSearch.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Ngăn hành vi mặc định (ví dụ: submit form)
            applyFilters();
        }
    });

    // Hiện/ẩn mã QR dựa trên phương thức thanh toán
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', updateOrderSummary);
    });

    // Hiển thị và chức năng của nút quay lại đầu trang
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

    // --- KHỞI TẠO ---
    document.getElementById('orderIdDisplay').textContent = `Mã đơn hàng: #${orderId}`;
    updateOrderSummary();
});
