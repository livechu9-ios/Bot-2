const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const selectFileBtn = document.getElementById('select-file-btn');
const fileInput = document.getElementById('file-input');

// Địa chỉ Server Python (đổi nếu cần)
const SERVER_URL = 'http://localhost:5000';

let isWaitingForAvatar = false;
let selectedDistortion = null;
let currentAvatarFile = null;

/* =========================================================
   📌 HÀM THÊM TIN NHẮN VÀO KHUNG CHAT
   ========================================================= */
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (sender === 'user') {
        messageDiv.classList.add('user-message');
        messageDiv.textContent = text;
    } else {
        messageDiv.classList.add('bot-message');
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');
    }
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================================================
   🧠 HÀM XỬ LÝ CHAT TỰ ĐỘNG (BOT TRẢ LỜI)
   ========================================================= */
function getBotReply(text) {
    const t = text.toLowerCase().trim();

    // --- Chào hỏi ---
    if (/(^|\s)(hi|hello|hey|chào|chao|xin chào|alo)(\s|$)/.test(t)) {
        const replies = [
            "Chào bạn 👋 Mình là Trung Nhỏ, rất vui được gặp!",
            "Hi hi~ Bạn cần mình giúp gì không? 😊",
            "Chào cậu! Hôm nay thế nào? 🌸"
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }

    // --- Hỏi thăm ---
    if (t.includes("khỏe không") || t.includes("khoe khong") || t.includes("thế nào") || t.includes("the nao")) {
        return "Mình khỏe lắm, cảm ơn bạn! Còn bạn thì sao? 💖";
    }
    if (t.includes("bạn là ai") || t.includes("ban la ai") || t.includes("tên gì") || t.includes("ten gi")) {
        return "Mình là <b>Trung Nhỏ</b> 🤖 — trợ lý chat siêu dễ thương của bạn!";
    }
    if (t.includes("bao nhiêu tuổi") || t.includes("tuổi") || t.includes("tuoi")) {
        return "Mình mới được tạo ra thôi, nên còn trẻ lắm 😆";
    }

    // --- Cảm ơn ---
    if (t.includes("cảm ơn") || t.includes("cam on") || t.includes("thanks") || t.includes("thank")) {
        return "Không có gì đâu~ Rất vui được giúp bạn! 💕";
    }

    // --- Xin lỗi ---
    if (t.includes("xin lỗi") || t.includes("sorry")) {
        return "Không sao đâu nè, mình luôn ở đây mà 🥰";
    }

    // --- Tạm biệt ---
    if (/(^|\s)(bye|tạm biệt|tam biet|pp|goodbye)(\s|$)/.test(t)) {
        return "Tạm biệt bạn nhé! Hẹn gặp lại 👋💖";
    }

    // --- Yêu thích ---
    if (t.includes("yêu") || t.includes("thích") || t.includes("thuong")) {
        return "Mình cũng yêu bạn nhiều lắm 😘";
    }

    // --- Hỏi về chức năng ---
    if (t.includes("làm được gì") || t.includes("chức năng") || t.includes("help") || t.includes("giúp gì")) {
        return "Mình có thể:\n👉 Gõ <b>/start</b> để xem hướng dẫn\n👉 Gõ <b>/mod</b> để xem danh sách mod\n👉 Gõ <b>/filefree</b> để xem file free\n👉 Gõ <b>/avatar</b> để biến dạng ảnh 🎨";
    }

    // --- Hỏi giờ ---
    if (t.includes("mấy giờ") || t.includes("giờ") || t.includes("time")) {
        const now = new Date();
        return `Bây giờ là <b>${now.getHours()} giờ ${now.getMinutes()} phút</b> ⏰`;
    }

    // --- Hỏi ngày ---
    if (t.includes("hôm nay") || t.includes("ngày mấy") || t.includes("thứ mấy")) {
        const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
        const now = new Date();
        return `Hôm nay là <b>${days[now.getDay()]}</b>, ngày <b>${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}</b> 📅`;
    }

    // --- Đồ ăn ---
    if (t.includes("đói") || t.includes("ăn gì") || t.includes("món gì")) {
        return "Hay là ăn phở, bún bò hay cơm tấm nhỉ? 🍜 Mình đói theo luôn rồi!";
    }

    // --- Cười ---
    if (t.includes("haha") || t.includes("hihi") || t.includes("vui") || t.includes("cười")) {
        return "Hihi 😄 Bạn vui thì mình cũng vui!";
    }

    // --- Buồn ---
    if (t.includes("buồn") || t.includes("mệt") || t.includes("chán")) {
        return "Đừng buồn nha, có mình ở đây rồi 💖 Kể mình nghe chuyện gì đi!";
    }

    // --- Hỏi tên người dùng ---
    if (t.includes("tên tôi") || t.includes("tên mình") || t.includes("gọi tôi")) {
        return "Bạn chưa nói tên mà 😅 Bạn tên gì thế?";
    }

    // --- Default ---
    const defaults = [
        "Hmm, mình chưa hiểu lắm 🤔 Bạn nói rõ hơn được không?",
        "Nghe thú vị đó! Kể tiếp đi nào 😊",
        "Ừm... mình đang lắng nghe đây 👂",
        "Gõ <b>/start</b> để xem mình làm được gì nhé!",
        "Ơ hay, mình chưa được lập trình để hiểu câu này 😅"
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
}

/* =========================================================
   🎨 CHỌN MỨC BIẾN DẠNG
   ========================================================= */
function showDistortionOptions() {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot-message');
    let optionsHTML = `<b>🎨 Chọn mức biến dạng cho Avatar:</b><div class="distortion-options">`;
    for (let i = 1; i <= 5; i++) {
        optionsHTML += `<button class="distortion-btn" data-value="${i}.0">□ Mặt ${i}</button>`;
    }
    optionsHTML += `</div>`;
    messageDiv.innerHTML = optionsHTML;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    messageDiv.querySelectorAll('.distortion-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            messageDiv.querySelectorAll('.distortion-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedDistortion = this.getAttribute('data-value');
            showSendFileButton();
        });
    });
}

function showSendFileButton() {
    if (document.getElementById('final-send-btn')) return;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot-message');
    messageDiv.innerHTML = `Bạn đã chọn mức <b>${selectedDistortion}</b>. Bấm nút bên dưới để xử lý và lưu file:`;
    const sendBtn = document.createElement('button');
    sendBtn.id = 'final-send-btn';
    sendBtn.className = 'send-file-btn';
    sendBtn.innerHTML = `📥 Gửi file & Xử lý`;
    messageDiv.appendChild(sendBtn);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    sendBtn.addEventListener('click', () => {
        if (!currentAvatarFile) {
            addMessage("❌ Không tìm thấy file để xử lý. Vui lòng thử lại!", 'bot');
            return;
        }

        addMessage(`⏳ Đang gửi ảnh lên server để xử lý với mức biến dạng ${selectedDistortion}...`, 'bot');

        const formData = new FormData();
        formData.append('file', currentAvatarFile);
        formData.append('distortion', selectedDistortion);

        fetch(`${SERVER_URL}/process-avatar`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('Server trả về lỗi');
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `avatar_${selectedDistortion}_${currentAvatarFile.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            addMessage(`✅ Xử lý thành công!<br>📁 File: <b>${currentAvatarFile.name}</b><br>🎨 Mức: <b>${selectedDistortion}</b><br>💾 File đã được tải về máy.`, 'bot');

            selectedDistortion = null;
            currentAvatarFile = null;
            isWaitingForAvatar = false;
            sendBtn.disabled = true;
            sendBtn.style.opacity = '0.5';
            sendBtn.innerHTML = `✅ Hoàn tất`;
        })
        .catch(error => {
            addMessage(`❌ Lỗi kết nối server: ${error.message}<br>Hãy chắc chắn <b>server.py</b> đang chạy.`, 'bot');
        });
    });
}

/* =========================================================
   📎 XỬ LÝ FILE GỬI LÊN
   ========================================================= */
function addFileMessage(file) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'user-message');
    const specialFileName = "assetindexer.U6Zffc4YIR3DslNj3cXvYGAqz58~3D";

    // === FILE ĐẶC BIỆT ===
    if (file.name === specialFileName) {
        const fileInfo = document.createElement('div');
        fileInfo.innerHTML = `📎 <b>${file.name}</b><br><small>${(file.size / 1024).toFixed(2)} KB</small>`;
        messageDiv.appendChild(fileInfo);
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        addMessage(`⏳ Đang gửi file <b>${specialFileName}</b> lên server để xử lý...`, 'bot');

        const formData = new FormData();
        formData.append('file', file);

        fetch(`${SERVER_URL}/process-asset`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addMessage(`✅ Server đã xử lý file <b>${file.name}</b> thành công!<br>💬 ${data.message}`, 'bot');
            } else {
                addMessage(`❌ Lỗi từ server: ${data.error}`, 'bot');
            }
        })
        .catch(error => {
            addMessage(`❌ Không kết nối được server.<br>Hãy chắc chắn <b>server.py</b> đang chạy.<br>Lỗi: ${error.message}`, 'bot');
        });
        return;
    }

    // === ẢNH ===
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            messageDiv.appendChild(img);
            chatBox.appendChild(messageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
            if (isWaitingForAvatar) {
                isWaitingForAvatar = false;
                currentAvatarFile = file;
                setTimeout(() => {
                    addMessage("✅ Đã nhận ảnh Avatar! Vui lòng chọn mức biến dạng:", 'bot');
                    showDistortionOptions();
                }, 500);
            }
        };
        reader.readAsDataURL(file);
    } else {
        const fileInfo = document.createElement('div');
        fileInfo.innerHTML = `📎 <b>${file.name}</b><br><small>${(file.size / 1024).toFixed(2)} KB</small>`;
        messageDiv.appendChild(fileInfo);
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        if (isWaitingForAvatar) {
            isWaitingForAvatar = false;
            setTimeout(() => {
                addMessage("❌ File bạn gửi không phải là ảnh. Vui lòng gửi lại file ảnh!", 'bot');
            }, 500);
        }
    }
}

/* =========================================================
   💬 HÀM GỬI TIN NHẮN
   ========================================================= */
function handleSend() {
    const text = messageInput.value.trim();
    if (text === '') return;

    addMessage(text, 'user');
    messageInput.value = '';

    // === LỆNH ĐẶC BIỆT ===
    if (text.toLowerCase() === '/avatar') {
        isWaitingForAvatar = true;
        selectedDistortion = null;
        currentAvatarFile = null;
        setTimeout(() => {
            addMessage("📸 Vui lòng gửi file ảnh bạn muốn biến dạng (bấm nút góc trái hoặc nút đính kèm):", 'bot');
        }, 500);
        return;
    }

    if (text.toLowerCase() === '/start') {
        setTimeout(() => {
            addMessage(`Chào bạn! Mình là Trung Nhỏ. Dưới đây là các lệnh:\n👉 /mod : Xem 5 ảnh và 5 link mod\n👉 /filefree : Xem 5 ảnh và 5 link file free\n👉 /avatar : Gửi ảnh và biến dạng (1.0 - 5.0)`, 'bot');
        }, 400);
        return;
    }

    if (text.toLowerCase() === '/mod') {
        setTimeout(() => {
            let modContent = `<b>DANH SÁCH MOD:</b><br>`;
            for (let i = 1; i <= 5; i++) {
                modContent += `<img src="https://images.unsplash.com/photo-${1500000000000 + i * 100000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Mod ${i}"><a href="https://example.com/mod${i}" target="_blank">📁 File Mod ${i}</a><br>`;
            }
            addMessage(modContent, 'bot');
        }, 400);
        return;
    }

    if (text.toLowerCase() === '/filefree') {
        setTimeout(() => {
            let fileContent = `<b>DANH SÁCH FILE FREE:</b><br>`;
            for (let i = 1; i <= 5; i++) {
                fileContent += `<img src="https://images.unsplash.com/photo-${1600000000000 + i * 100000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="File ${i}"><a href="https://example.com/file${i}" target="_blank">📄 File Free ${i}</a><br>`;
            }
            addMessage(fileContent, 'bot');
        }, 400);
        return;
    }

    // === CHAT TỰ ĐỘNG ===
    setTimeout(() => {
        const reply = getBotReply(text);
        addMessage(reply, 'bot');
    }, 500 + Math.random() * 500); // delay ngẫu nhiên cho tự nhiên
}

/* =========================================================
   🎯 GẮN SỰ KIỆN
   ========================================================= */
messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') handleSend();
});

selectFileBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', function () {
    if (this.files && this.files[0]) {
        addFileMessage(this.files[0]);
        this.value = '';
    }
});

document.querySelector('.circle-btn[title="Ghi âm"]').addEventListener('click', () => {
    alert('Chức năng ghi âm đang phát triển!');
});

document.querySelector('.circle-btn[title="Đính kèm"]').addEventListener('click', () => {
    fileInput.click();
});