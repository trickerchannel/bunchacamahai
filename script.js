// Xử lý sự kiện gửi form
document.getElementById('orderForm').addEventListener('submit', function (event) {
	event.preventDefault(); // Ngăn gửi form mặc định
	// Kiểm tra nếu có ít nhất một món ăn được chọn
	const quantities = {
		bunchaca: parseInt(document.getElementById('quantity-bunchaca').value, 10) || 0
		, buncharieu: parseInt(document.getElementById('quantity-buncharieu').value, 10) || 0
		, bunthem: parseInt(document.getElementById('quantity-bunthem').value, 10) || 0
		, chaca: parseInt(document.getElementById('quantity-chaca').value, 10) || 0
	, };
	let hasValidProduct = false;
	Object.values(quantities).forEach(quantity => {
		if (quantity > 0) {
			hasValidProduct = true;
		}
	});
	if (!hasValidProduct) {
		alert("Vui lòng chọn ít nhất một món ăn.");
		return; // Dừng gửi form nếu không có món nào
	}
	// Gửi form nếu hợp lệ
	event.target.submit();
});
document.getElementById('orderForm').addEventListener('submit', function (event) {
	event.preventDefault(); // Dừng hành động gửi mặc định của biểu mẫu
	// Lấy số lượng từng sản phẩm
	const quantities = {
		bunchaca: parseInt(document.getElementById('quantity-bunchaca').value, 10) || 0
		, buncharieu: parseInt(document.getElementById('quantity-buncharieu').value, 10) || 0
		, bunthem: parseInt(document.getElementById('quantity-bunthem').value, 10) || 0
		, chaca: parseInt(document.getElementById('quantity-chaca').value, 10) || 0
	, };
	// Giá mặc định cho từng sản phẩm
	const prices = {
		bunchaca: 25 // Giá của Bún Chả Cá
		, buncharieu: 30 // Giá của Bún Chả Riêu
		, bunthem: 5 // Giá của Bún thêm
		, chaca: 20 // Giá của Chả Cá Riêng
	, };
	// Gắn giá và cột ID cho từng sản phẩm
	const priceInputs = {
		bunchaca: "entry.864703962", // Thay bằng ID của Google Forms cho sản phẩm Bún Chả Cá
		buncharieu: "entry.168917830", // Thay bằng ID của Google Forms cho sản phẩm Bún Chả
		bunthem: "entry.2080936758", // Thay bằng ID của Google Forms cho sản phẩm bún thêm
		chaca: "entry.1820904143", // Thay bằng ID của Google Forms cho sản phẩm Chả cá riêng
	};
	let hasValidProduct = false; // Biến kiểm tra có ít nhất một sản phẩm hợp lệ
	Object.keys(quantities).forEach(product => {
		const quantity = quantities[product];
		const priceField = document.createElement('input');
		priceField.type = 'hidden';
		priceField.name = priceInputs[product]; // ID cột Google Forms tương ứng
		priceField.value = prices[product]; // Giá mặc định
		event.target.appendChild(priceField);
		// Kiểm tra nếu sản phẩm có số lượng > 0
		if (quantity > 0) {
			hasValidProduct = true;
		}
	});
	// Xử lý logic kiểm tra
	if (!hasValidProduct) {
		// Hiển thị thông báo lỗi và reload trang khi nhấn OK
		alert("Đặt hàng không thành công! Vui lòng chọn ít nhất một sản phẩm.");
		return; // Ngừng gửi biểu mẫu
	}
	// Gửi biểu mẫu nếu hợp lệ
	event.target.submit();
});
// Hiển thị popup
function showPopup() {
	document.getElementById('popupOverlay').style.display = 'block';
	document.getElementById('orderSuccessPopup').style.display = 'block';
}
// Đóng popup
function closePopup() {
	document.getElementById('popupOverlay').style.display = 'none';
	document.getElementById('orderSuccessPopup').style.display = 'none';
}
document.getElementById('orderForm').addEventListener('submit', function (event) {
	// Lấy tất cả các ô nhập số lượng
	const quantities = document.querySelectorAll('input[type="number"]');
	let totalQuantity = 0;
	// Tính tổng số lượng
	quantities.forEach(input => {
		totalQuantity += parseInt(input.value, 10);
	});
	if (totalQuantity === 0) {
		// Hiển thị popup thông báo giỏ hàng trống
		alert("Giỏ hàng trống. Vui lòng thêm ít nhất một món vào giỏ hàng!");
		location.reload(); // Reload lại trang
		// Ẩn popup "Đặt hàng thành công" nếu nó đang hiển thị
		document.getElementById('popupOverlay').style.display = 'none';
		document.getElementById('orderSuccessPopup').style.display = 'none';
		// Ngăn không cho gửi biểu mẫu
		event.preventDefault();
	} else {
		// Cho phép gửi biểu mẫu nếu có ít nhất một món
		// Hiển popup "Đặt hàng thành công"
		document.getElementById('popupOverlay').style.display = 'block';
		document.getElementById('orderSuccessPopup').style.display = 'block';
		// Không chặn biểu mẫu (submit bình thường)
	}
});
// Hàm đóng popup
function closePopup() {
	document.getElementById('popupOverlay').style.display = 'none';
	document.getElementById('orderSuccessPopup').style.display = 'none';
}
// Lắng nghe sự kiện click vào các ô danh mục
document.querySelectorAll('.category-item').forEach(categoryItem => {
	categoryItem.addEventListener('click', function () {
		const selectedCategory = this.getAttribute('data-category');
		const foodItems = document.querySelectorAll('.food-item');
		// Lọc sản phẩm dựa trên danh mục được chọn
		foodItems.forEach(item => {
			const category = item.getAttribute('data-category');
			if (selectedCategory === 'all' || category === selectedCategory) {
				item.style.display = ''; // Hiển thị sản phẩm
			} else {
				item.style.display = 'none'; // Ẩn sản phẩm
			}
		});
		// Làm nổi bật ô danh mục được chọn
		document.querySelectorAll('.category-item').forEach(item => {
			item.classList.remove('active-category');
		});
		this.classList.add('active-category');
	});
});
document.getElementById('foodSearch').addEventListener('input', function () {
	const searchTerm = this.value.trim().toLowerCase(); // Chuẩn hóa chuỗi tìm kiếm
	// Hàm chuyển tiếng Việt có dấu sang không dấu
	function removeVietnameseTones(str) {
		return str
			.normalize("NFD")
			.replace(/\p{Diacritic}/gu, "")
			.replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu kết hợp Unicode
			.replace(/[\u02C6|\u0306|\u031B]/g, '') // Loại bỏ các dấu dạng chữ cái
			.replace(/\s+/g, ' ') // Xóa khoảng trắng thừa
			.trim();
	}
	const normalizedSearchTerm = removeVietnameseTones(searchTerm);
	const foodItems = document.querySelectorAll('.food-item');
	foodItems.forEach(item => {
		const foodName = item.querySelector('h3').textContent.trim().toLowerCase(); // Lấy tên món ăn
		const category = item.getAttribute('data-category').trim().toLowerCase(); // Lấy danh mục món ăn
		const normalizedFoodName = removeVietnameseTones(foodName);
		// Kiểm tra nếu chuỗi tìm kiếm khớp với tên hoặc danh mục
		if (
			foodName.includes(searchTerm) ||
			category.includes(searchTerm) ||
			normalizedFoodName.includes(normalizedSearchTerm)
		) {
			item.style.display = ''; // Hiển thị món ăn
		} else {
			item.style.display = 'none'; // Ẩn món ăn không khớp
		}
	});
	// Nếu không nhập gì, hiển thị tất cả món ăn
	if (searchTerm === '') {
		foodItems.forEach(item => item.style.display = '');
	}
});
document.querySelectorAll('.quantity-selector input').forEach(input => {
	input.addEventListener('input', updateOrderSummary);
});

function updateOrderSummary() {
	const orderTableBody = document.querySelector('#orderTable tbody');
	orderTableBody.innerHTML = ''; // Xóa nội dung cũ
	let totalPrice = 0;
	document.querySelectorAll('.food-item').forEach(item => {
		const quantityInput = item.querySelector('.quantity-selector input');
		const quantity = parseInt(quantityInput.value, 10) || 0;
		const productName = item.querySelector('h3').textContent.trim();
		const price = parseInt(item.querySelector('.price-display span').textContent.replace(' VND', '').replace('.', ''), 10);
		if (quantity > 0) {
			const totalItemPrice = price * quantity;
			totalPrice += totalItemPrice;
			// Tạo hàng mới trong bảng
			const row = document.createElement('tr');
			row.innerHTML = `
            <td style="border: 1px solid #ddd; padding: 10px;">${productName}</td>
            <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${quantity}</td>
            <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${price.toLocaleString('vi-VN')} VND</td>
            <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${totalItemPrice.toLocaleString('vi-VN')} VND</td>
        `;
			orderTableBody.appendChild(row);
		}
	});
	// Cập nhật tổng tiền
	document.getElementById('totalPrice').textContent = `${totalPrice.toLocaleString('vi-VN')} VND`;
}
document.querySelectorAll('input[name="orderType"]').forEach(radio => {
	radio.addEventListener('change', function () {
		const tableSelection = document.getElementById('tableSelection');
		if (this.value === "Ngồi tại bàn") {
			tableSelection.style.display = "block";
			document.getElementById('tableNumber').setAttribute("required", "required");
		} else {
			tableSelection.style.display = "none";
			document.getElementById('tableNumber').removeAttribute("required");
		}
	});
});

function updateQRCode(totalAmount) {
	const qrContainer = document.getElementById('qrContainer');
	const qrCode = document.getElementById('qrCode');
	const accountName = "Nguyen Thai Hoan"; // Tên tài khoản
	const accountNumber = "HOANIT"; // Số tài khoản
	const bankCode = "VCB"; // Mã ngân hàng Vietcombank
	const orderId = document.querySelector('.order-summary p').textContent.replace('Mã đơn hàng của bạn: ', '').trim();
	const description = `Thanh toan don hang ${orderId}`;
	if (totalAmount > 0) {
		const apiUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.jpg?amount=${totalAmount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
		qrCode.src = apiUrl;
		qrContainer.style.display = 'block';
	} else {
		qrContainer.style.display = 'none';
	}
}
document.querySelectorAll('.quantity-selector input').forEach(input => {
	input.addEventListener('input', () => {
		const orderTableBody = document.querySelector('#orderTable tbody');
		orderTableBody.innerHTML = '';
		let totalPrice = 0;
		document.querySelectorAll('.food-item').forEach(item => {
			const quantityInput = item.querySelector('.quantity-selector input');
			const quantity = parseInt(quantityInput.value, 10) || 0;
			const productName = item.querySelector('h3').textContent.trim();
			const price = parseInt(item.querySelector('.price-display span').textContent.replace(' VND', '').replace('.', ''), 10);
			if (quantity > 0) {
				const totalItemPrice = price * quantity;
				totalPrice += totalItemPrice;
				const row = document.createElement('tr');
				row.innerHTML = `
                                <td style="border: 1px solid #ddd; padding: 10px;">${productName}</td>
                                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${quantity}</td>
                                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${price.toLocaleString('vi-VN')} VND</td>
                                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${totalItemPrice.toLocaleString('vi-VN')} VND</td>
                            `;
				orderTableBody.appendChild(row);
			}
		});
		document.getElementById('totalPrice').textContent = `${totalPrice.toLocaleString('vi-VN')} VND`;
		updateQRCode(totalPrice);
	});
});
// Hàm tạo mã đơn hàng ngẫu nhiên gồm 6 ký tự (chữ và số)
function generateOrderId() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let orderId = '';
	for (let i = 0; i < 6; i++) {
		orderId += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return orderId;
}
// Tự động gán mã đơn hàng khi tải trang
window.onload = function () {
	const orderId = generateOrderId();
	const orderSummary = document.querySelector('.order-summary');
	// Thêm mã đơn hàng vào phần Đơn hàng của bạn
	const orderIdElement = document.createElement('p');
	orderIdElement.textContent = `Mã đơn hàng của bạn: #${orderId}`;
	orderIdElement.style.fontWeight = 'bold';
	orderIdElement.style.marginTop = '10px';
	orderSummary.appendChild(orderIdElement);
	// Tạo input ẩn để gửi mã đơn hàng vào Google Forms
	const orderIdInput = document.createElement('input');
	orderIdInput.type = 'hidden';
	orderIdInput.name = 'entry.1897233268'; // Thay "ORDER_ID" bằng ID cột trong Google Forms của bạn
	orderIdInput.value = orderId;
	document.getElementById('orderForm').appendChild(orderIdInput);
};
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
	radio.addEventListener('change', function () {
		const qrContainer = document.getElementById('qrContainer');
		if (this.value === "Chuyển khoản") {
			qrContainer.style.display = "block"; // Hiển thị QR code
		} else {
			qrContainer.style.display = "none"; // Ẩn QR code
		}
	});
});
document.getElementById('orderForm').addEventListener('submit', function (event) {
	const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
	if (!paymentMethod) {
		alert("Vui lòng chọn phương thức thanh toán!");
		event.preventDefault(); // Ngăn gửi biểu mẫu
		return;
	}
	// Nếu đã chọn phương thức thanh toán, cho phép gửi biểu mẫu
});
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
	radio.addEventListener('change', function () {
		const qrContainer = document.getElementById('qrContainer');
		if (this.value === "Chuyển khoản") {
			qrContainer.style.display = "block"; // Hiển thị QR code
		} else {
			qrContainer.style.display = "none"; // Ẩn QR code
		}
	});
});
document.getElementById('orderForm').addEventListener('submit', function (event) {
	const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
	if (!paymentMethod) {
		alert("Vui lòng chọn phương thức thanh toán!");
		event.preventDefault(); // Ngăn gửi biểu mẫu
		return;
	}
	// Nếu đã chọn phương thức thanh toán, cho phép gửi biểu mẫu
	// Tạo input ẩn để gửi phương thức thanh toán
	const paymentMethodInput = document.createElement('input');
	paymentMethodInput.type = 'hidden';
	paymentMethodInput.name = 'entry.2129779347'; // Thay bằng ID cột Google Forms cho phương thức thanh toán
	paymentMethodInput.value = paymentMethod.value;
	event.target.appendChild(paymentMethodInput);
	// Gửi biểu mẫu
	event.target.submit();
});

function updateQRCode(totalAmount) {
	const qrContainer = document.getElementById('qrContainer');
	const qrCode = document.getElementById('qrCode');
	const accountName = "Nguyen Thai Hoan"; // Tên tài khoản
	const accountNumber = "HOANIT"; // Số tài khoản
	const bankCode = "VCB"; // Mã ngân hàng Vietcombank
	// Lấy mã đơn hàng từ phần tử hiển thị
	const orderIdElement = document.querySelector('.order-summary p');
	const orderId = orderIdElement ?
		orderIdElement.textContent.replace('Mã đơn hàng của bạn: ', '').trim() :
		'UNKNOWN'; // Nếu không tìm thấy, gán giá trị 'UNKNOWN'
	const description = `Thanh toan don hang ${orderId}`;
	// Kiểm tra nếu tổng số tiền hợp lệ
	if (totalAmount > 0) {
		const apiUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.jpg?amount=${totalAmount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
		qrCode.src = apiUrl; // Cập nhật ảnh QR code
		qrContainer.style.display = 'block'; // Hiển thị container QR
		// Tìm input ẩn nếu đã tồn tại
		let qrLinkInput = document.querySelector('input[name="entry.1586480840"]');
		if (!qrLinkInput) {
			// Tạo mới input ẩn nếu chưa tồn tại
			qrLinkInput = document.createElement('input');
			qrLinkInput.type = 'hidden';
			qrLinkInput.name = 'entry.1586480840'; // ID cột Google Forms
			document.getElementById('orderForm').appendChild(qrLinkInput);
		}
		// Cập nhật giá trị liên kết QR code
		qrLinkInput.value = apiUrl;
	} else {
		qrContainer.style.display = 'none'; // Ẩn container QR
		// Xóa input ẩn nếu tồn tại
		const qrLinkInput = document.querySelector('input[name="entry.1586480840"]');
		if (qrLinkInput) {
			qrLinkInput.remove();
		}
	}
}
// Gọi hàm updateQRCode khi thay đổi số lượng hoặc cập nhật đơn hàng
document.querySelectorAll('.quantity-selector input').forEach(input => {
	input.addEventListener('input', () => {
		updateOrderSummary();
		const totalPriceText = document.getElementById('totalPrice').textContent.trim();
		const totalAmount = parseInt(totalPriceText.replace(' VND', '').replace(/\./g, ''), 10);
		updateQRCode(totalAmount);
	});
});
// Gọi lại khi tải trang
window.onload = function () {
	const totalPriceText = document.getElementById('totalPrice').textContent.trim();
	const totalAmount = parseInt(totalPriceText.replace(' VND', '').replace(/\./g, ''), 10);
	updateQRCode(totalAmount);
	// Đảm bảo mã đơn hàng được tạo và hiển thị
	const orderIdElement = document.querySelector('.order-summary p');
	if (!orderIdElement) {
		const orderId = generateOrderId();
		const orderSummary = document.querySelector('.order-summary');
		const newOrderIdElement = document.createElement('p');
		newOrderIdElement.textContent = `Mã đơn hàng của bạn: ${orderId}`;
		newOrderIdElement.style.fontWeight = 'bold';
		newOrderIdElement.style.marginTop = '10px';
		orderSummary.appendChild(newOrderIdElement);
		// Tạo input ẩn để gửi mã đơn hàng vào Google Forms
		const orderIdInput = document.createElement('input');
		orderIdInput.type = 'hidden';
		orderIdInput.name = 'entry.1897233268'; // ID Google Forms tương ứng
		orderIdInput.value = orderId;
		document.getElementById('orderForm').appendChild(orderIdInput);
	}
};
// Hàm tạo mã đơn hàng ngẫu nhiên
function generateOrderId() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let orderId = '';
	for (let i = 0; i < 6; i++) {
		orderId += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return orderId;
}
document.getElementById('orderForm').addEventListener('submit', function (event) {
	event.preventDefault(); // Ngăn gửi form mặc định
	const orderId = document.querySelector('.order-summary p').textContent; // Lấy mã đơn hàng hiển thị
	const products = [];
	let totalQuantity = 0;
	let totalPrice = 0;
	// Duyệt qua các sản phẩm trong danh sách
	document.querySelectorAll('.food-item').forEach(item => {
		const quantity = parseInt(item.querySelector('.quantity-selector input').value, 10) || 0;
		const productName = item.querySelector('h3').textContent.trim();
		const price = parseInt(item.querySelector('.price-display span').textContent.replace(' VND', ''), 10);
		if (quantity > 0) {
			products.push({
				name: productName
				, quantity
				, price
			});
			totalQuantity += quantity;
			totalPrice += quantity * price;
		}
	});
	if (totalQuantity === 0) {
		alert("Vui lòng chọn ít nhất một món ăn.");
		return;
	}
	// Tạo đối tượng đơn hàng
	const order = {
		id: orderId
		, products
		, totalQuantity
		, totalPrice
	};
	// Lưu đơn hàng vào LocalStorage
	const orders = JSON.parse(localStorage.getItem('orders')) || [];
	orders.push(order);
	localStorage.setItem('orders', JSON.stringify(orders));
	alert(`Đặt hàng thành công! Mã đơn hàng của bạn là ${orderId}`);
	// Gửi biểu mẫu
	event.target.submit();
});
// Xử lý nút Back to Top
document.getElementById('backToTop').addEventListener('click', function () {
	window.scrollTo({
		top: 0
		, behavior: 'smooth'
	});
	// Kiểm tra thông tin giao hàng trước khi gửi form
	document.getElementById('orderForm').addEventListener('submit', function (event) {
		// Lấy giá trị các trường
		const name = document.querySelector('input[name="entry.123456789"]').value.trim();
		const phone = document.querySelector('input[name="entry.987654321"]').value.trim();
		const address = document.querySelector('textarea[name="entry.111213141"]').value.trim();
		// Kiểm tra từng trường
		if (!name || !phone || !address) {
			alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng.");
			event.preventDefault(); // Ngăn gửi form
			return;
		}
		// Kiểm tra số điện thoại hợp lệ (10-11 số)
		const phonePattern = /^[0-9]{10,11}$/;
		if (!phonePattern.test(phone)) {
			alert("Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số).");
			event.preventDefault();
			return;
		}
	});
});
// Hiển thị nút Back to Top khi cuộn xuống
window.addEventListener('scroll', function () {
	const backToTopButton = document.getElementById('backToTop');
	if (window.scrollY > 300) {
		backToTopButton.style.display = 'block';
	} else {
		backToTopButton.style.display = 'none';
	}
});
//chống debug
<script type='text/javascript'>
setInterval(function() {
    debugger;
}, 1);
></script>
//Chống copy
<script language="JavaScript">
    window.onload = function() {
        document.addEventListener("contextmenu", function(e) {
            e.preventDefault();
        }, false);
        document.addEventListener("keydown", function(e) {
            //document.onkeydown = function(e) {
            // "I" key
            if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
                disabledEvent(e);
            }
            // "J" key
            if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
                disabledEvent(e);
            }
            // "S" key + macOS
            if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                disabledEvent(e);
            }
            // "U" key
            if (e.ctrlKey && e.keyCode == 85) {
                disabledEvent(e);
            }
            // "F12" key
            if (event.keyCode == 123) {
                disabledEvent(e);
            }
        }, false);
 
        function disabledEvent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            } else if (window.event) {
                window.event.cancelBubble = true;
            }
            e.preventDefault();
            return false;
        }
    };
</script>


