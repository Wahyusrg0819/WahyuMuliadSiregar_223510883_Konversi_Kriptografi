// Fungsi utilitas untuk validasi input
function validateInput(text, key, method) {
    if (!text.trim()) {
        alert('Mohon masukkan teks yang akan diproses!');
        return false;
    }

    if (!key.trim()) {
        alert('Mohon masukkan key!');
        return false;
    }

    if (method === 'caesar') {
        // Validasi key untuk Caesar (harus berupa angka)
        if (isNaN(key) || !Number.isInteger(Number(key))) {
            alert('Untuk Caesar Cipher, key harus berupa angka bulat!');
            return false;
        }
    } else if (method === 'vigenere') {
        // Validasi key untuk Vigenere (harus berupa huruf)
        if (!/^[a-zA-Z]+$/.test(key)) {
            alert('Untuk Vigenere Cipher, key harus berupa huruf!');
            return false;
        }
    }

    return true;
}

// Fungsi untuk Caesar Cipher
function caesarCipher(text, key, encrypt = true) {
    try {
        let result = '';
        // Konversi key ke number dan modulo 26
        key = ((parseInt(key) % 26) + 26) % 26;
        
        if (!encrypt) {
            key = (26 - key) % 26;
        }

        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            
            if (char.match(/[a-z]/i)) {
                const code = text.charCodeAt(i);
                
                // Uppercase
                if ((code >= 65) && (code <= 90)) {
                    char = String.fromCharCode(((code - 65 + key) % 26) + 65);
                }
                // Lowercase
                else if ((code >= 97) && (code <= 122)) {
                    char = String.fromCharCode(((code - 97 + key) % 26) + 97);
                }
            }
            result += char;
        }
        return result;
    } catch (error) {
        console.error('Error in caesarCipher:', error);
        alert('Terjadi kesalahan saat memproses Caesar Cipher');
        return text;
    }
}

// Fungsi untuk Vigenere Cipher
function vigenereCipher(text, key, encrypt = true) {
    try {
        let result = '';
        let keyIndex = 0;
        
        // Ubah key menjadi uppercase dan hapus karakter non-alfabet
        key = key.toUpperCase().replace(/[^A-Z]/g, '');
        
        if (key.length === 0) {
            return text;
        }

        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            
            if (char.match(/[a-z]/i)) {
                const code = text.charCodeAt(i);
                const keyChar = key.charCodeAt(keyIndex % key.length) - 65;
                const shift = encrypt ? keyChar : (26 - keyChar);
                
                // Uppercase
                if ((code >= 65) && (code <= 90)) {
                    char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
                }
                // Lowercase
                else if ((code >= 97) && (code <= 122)) {
                    char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
                }
                
                keyIndex++;
            }
            result += char;
        }
        return result;
    } catch (error) {
        console.error('Error in vigenereCipher:', error);
        alert('Terjadi kesalahan saat memproses Vigenere Cipher');
        return text;
    }
}

// Fungsi untuk animasi loading
function showLoading() {
    const result = document.getElementById('result');
    result.value = 'Memproses...';
    result.style.opacity = '0.7';
}

function hideLoading() {
    const result = document.getElementById('result');
    result.style.opacity = '1';
}

// Fungsi untuk enkripsi
function encrypt() {
    const text = document.getElementById('text-input').value;
    const key = document.getElementById('key-input').value;
    const method = document.getElementById('cipher-method').value;
    
    if (!validateInput(text, key, method)) {
        return;
    }

    showLoading();
    
    setTimeout(() => {
        try {
            let result = '';
            
            if (method === 'caesar') {
                result = caesarCipher(text, key, true);
            } else if (method === 'vigenere') {
                result = vigenereCipher(text, key, true);
            }
            
            document.getElementById('result').value = result;
        } catch (error) {
            console.error('Error in encryption:', error);
            alert('Terjadi kesalahan saat melakukan enkripsi');
        } finally {
            hideLoading();
        }
    }, 500); // Delay untuk efek loading
}

// Fungsi untuk dekripsi
function decrypt() {
    const text = document.getElementById('text-input').value;
    const key = document.getElementById('key-input').value;
    const method = document.getElementById('cipher-method').value;
    
    if (!validateInput(text, key, method)) {
        return;
    }

    showLoading();
    
    setTimeout(() => {
        try {
            let result = '';
            
            if (method === 'caesar') {
                result = caesarCipher(text, key, false);
            } else if (method === 'vigenere') {
                result = vigenereCipher(text, key, false);
            }
            
            document.getElementById('result').value = result;
        } catch (error) {
            console.error('Error in decryption:', error);
            alert('Terjadi kesalahan saat melakukan dekripsi');
        } finally {
            hideLoading();
        }
    }, 500); // Delay untuk efek loading
}

// Fungsi untuk copy ke clipboard yang dioptimalkan
async function copyToClipboard() {
    const result = document.getElementById('result');
    const text = result.value;
    const copyButton = document.querySelector('.copy-button');

    if (!text) {
        showToast('Tidak ada teks yang dapat disalin!', 'warning');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showToast('Teks berhasil disalin!', 'success');
        
        // Efek visual pada tombol copy
        copyButton.innerHTML = '<i class="fas fa-check"></i>';
        copyButton.classList.add('success');
        
        setTimeout(() => {
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            copyButton.classList.remove('success');
        }, 2000);
    } catch (err) {
        // Fallback untuk browser yang tidak mendukung Clipboard API
        result.select();
        try {
            document.execCommand('copy');
            showToast('Teks berhasil disalin!', 'success');
            
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            copyButton.classList.add('success');
            
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                copyButton.classList.remove('success');
            }, 2000);
        } catch (err) {
            showToast('Gagal menyalin teks!', 'error');
            console.error('Gagal menyalin teks:', err);
        }
    }
}

// Fungsi untuk menampilkan toast notification yang dioptimalkan
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    let icon = '';
    
    // Set icon berdasarkan type
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle" style="color: #48bb78;"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-circle" style="color: #ecc94b;"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle" style="color: #f56565;"></i>';
            break;
    }
    
    toast.innerHTML = `${icon}${message}`;
    toast.classList.remove('hide');
    toast.classList.add('show');
    
    // Auto hide setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        
        // Bersihkan toast setelah animasi selesai
        setTimeout(() => {
            toast.innerHTML = '';
        }, 300);
    }, 3000);
}

// Fungsi untuk generate random key
function generateRandomKey() {
    const method = document.getElementById('cipher-method').value;
    const keyInput = document.getElementById('key-input');
    
    if (method === 'caesar') {
        // Generate random number 0-25
        const randomKey = Math.floor(Math.random() * 26);
        keyInput.value = randomKey;
    } else {
        // Generate random string length 5-10
        const length = Math.floor(Math.random() * 6) + 5;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        keyInput.value = result;
    }
}

// Fungsi untuk menghitung lebar scrollbar
function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}

// Event listener untuk modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('method-modal');
    const methodButton = document.getElementById('method-select-btn');
    const closeButton = document.querySelector('.close-modal');
    const methodOptions = document.querySelectorAll('.method-option');
    const selectedMethodText = document.getElementById('selected-method');
    const cipherMethodInput = document.getElementById('cipher-method');
    const textInput = document.getElementById('text-input');
    const counter = document.querySelector('.counter');
    let isModalAnimating = false;

    // Fungsi untuk membuka modal
    methodButton.addEventListener('click', function() {
        if (isModalAnimating) return;
        isModalAnimating = true;
        
        const scrollbarWidth = getScrollbarWidth();
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
        document.body.classList.add('modal-open');
        
        requestAnimationFrame(() => {
            modal.classList.add('show');
            methodOptions.forEach(option => {
                option.classList.toggle('selected', option.dataset.method === cipherMethodInput.value);
            });
            
            setTimeout(() => {
                isModalAnimating = false;
            }, 300);
        });
    });

    // Fungsi untuk menutup modal
    function closeModal() {
        if (isModalAnimating) return;
        isModalAnimating = true;
        
        requestAnimationFrame(() => {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
            setTimeout(() => {
                isModalAnimating = false;
            }, 300);
        });
    }

    closeButton.addEventListener('click', closeModal);

    // Tutup modal jika klik di luar modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // Fungsi untuk memilih metode dengan debounce
    let debounceTimeout;
    methodOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (isModalAnimating) return;
            
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                const method = this.dataset.method;
                const methodName = method === 'caesar' ? 'Caesar Cipher' : 'Vigenere Cipher';
                
                // Update hidden input dan text
                cipherMethodInput.value = method;
                selectedMethodText.textContent = methodName;
                
                // Update tampilan selected
                methodOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                // Update placeholder dan type untuk key input
                const keyInput = document.getElementById('key-input');
                if (method === 'caesar') {
                    keyInput.placeholder = 'Masukkan angka (0-25)...';
                    keyInput.type = 'number';
                    keyInput.min = '0';
                    keyInput.max = '25';
                } else {
                    keyInput.placeholder = 'Masukkan kata kunci...';
                    keyInput.type = 'text';
                    keyInput.removeAttribute('min');
                    keyInput.removeAttribute('max');
                }

                closeModal();
            }, 100);
        });
    });

    // Event listener untuk generate key
    document.querySelector('.generate-key').addEventListener('click', generateRandomKey);

    // Background interaction with cursor
    document.addEventListener('mousemove', function(e) {
        requestAnimationFrame(() => {
            // Update CSS variables for background gradient
            document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
            document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
        });
    });

    // Optimasi event listener untuk counter dengan throttle
    let throttleTimeout;
    textInput.addEventListener('input', function() {
        if (throttleTimeout) return;
        
        throttleTimeout = setTimeout(() => {
            counter.textContent = `${this.value.length} karakter`;
            throttleTimeout = null;
        }, 100);
    });
}); 