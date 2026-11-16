// Menjalankan script setelah seluruh elemen DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. FITUR SAPAAN BERDASARKAN WAKTU (GREETING)
       ========================================================== */
    const jam = new Date().getHours();
    const elemenSapa = document.getElementById('sapa') || document.querySelector('.namek');

    if (elemenSapa) {
        if (jam >= 4 && jam < 11) {
            elemenSapa.innerText = "🌅 Selamat Pagi, Saya Pranata";
        } else if (jam >= 11 && jam < 15) {
            elemenSapa.innerText = "☀️ Selamat Siang, Saya Pranata";
        } else if (jam >= 15 && jam < 18) {
            elemenSapa.innerText = "🌇 Selamat Sore, Saya Pranata";
        } else {
            elemenSapa.innerText = "🌙 Selamat Malam, Saya Pranata";
        }
    }


    /* ==========================================================
       2. FITUR SISTEM TAB (ABOUT, PROJECT, MORE)
       ========================================================== */
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Ambil id tab tujuan dari atribut data-tab
            const targetTabId = link.getAttribute('data-tab');

            // Hapus kelas 'active' dari semua tautan navigasi dan tab konten
            navLinks.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            // Aktifkan tab dan tautan yang dipilih
            link.classList.add('active');
            const targetTab = document.getElementById(targetTabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });


    /* ==========================================================
       3. FITUR MODE GELAP / TERANG (DARK MODE TOGGLE)
       ========================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('pranata_theme');

    // Cek preferensi tema sebelumnya di localStorage
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.innerText = '☀️';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');

            themeToggleBtn.innerText = isDark ? '☀️' : '🌙';
            localStorage.setItem('pranata_theme', isDark ? 'dark' : 'light');

            showToast(isDark ? 'Mode Gelap diaktifkan 🌙' : 'Mode Terang diaktifkan ☀️');
        });
    }


    /* ==========================================================
       4. FITUR MODAL POPUP (HUBUNGI SAYA)
       ========================================================== */
    const btnContact = document.getElementById('btn-contact');
    const contactModal = document.getElementById('contact-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const contactForm = document.getElementById('contact-form');

    // Buka Modal
    if (btnContact && contactModal) {
        btnContact.addEventListener('click', () => {
            contactModal.classList.add('show');
            const inputNama = document.getElementById('contact-name');
            if (inputNama) inputNama.focus();
        });
    }

    // Fungsi tutup modal
    const closeModal = () => {
        if (contactModal) {
            contactModal.classList.remove('show');
        }
    };

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', closeModal);
    }

    // Tutup jika klik area latar gelap di luar modal
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeModal();
            }
        });
    }

    // Tutup jika menekan tombol Escape di keyboard
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal && contactModal.classList.contains('show')) {
            closeModal();
        }
    });

    // Handle submit formulir kontak
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nama = document.getElementById('contact-name').value.trim();
            const pesan = document.getElementById('contact-message').value.trim();

            if (nama && pesan) {
                showToast(`Terima kasih ${nama}, pesan Anda berhasil dikirim! 🚀`);
                contactForm.reset();
                closeModal();
            }
        });
    }


    /* ==========================================================
       5. FITUR TOMBOL DUKUNGAN / LIKE COUNTER DENGAN LOCALSTORAGE
       ========================================================== */
    const btnLike = document.getElementById('btn-like');
    const likeCountSpan = document.getElementById('like-count');

    // Ambil total like yang sudah tersimpan
    let currentLikes = parseInt(localStorage.getItem('pranata_likes')) || 0;
    if (likeCountSpan) {
        likeCountSpan.innerText = currentLikes;
    }

    if (btnLike && likeCountSpan) {
        btnLike.addEventListener('click', () => {
            currentLikes++;
            likeCountSpan.innerText = currentLikes;
            localStorage.setItem('pranata_likes', currentLikes);

            // Animasi memantul (bounce)
            btnLike.classList.remove('liked');
            void btnLike.offsetWidth; // Memicu reflow browser agar animasi dapat diulang
            btnLike.classList.add('liked');

            showToast('Terima kasih atas dukungannya! ❤️');
        });
    }


    /* ==========================================================
       6. FITUR KUTIPAN INSPIRATIF ACAK (RANDOM QUOTE GENERATOR)
       ========================================================== */
    const quotes = [
        {
            text: "Koding bukan tentang mengetik cepat, tapi tentang memecahkan masalah langkah demi langkah.",
            author: "- Pranata"
        },
        {
            text: "Setiap programmer ahli dulunya adalah pemula yang tidak pernah berhenti belajar.",
            author: "- Pepatah Developer"
        },
        {
            text: "CSS membuat tampilan menarik, JavaScript memberi kehidupan dan interaksi pada halaman web.",
            author: "- Web Dev Quote"
        },
        {
            text: "Belajar coding adalah maraton, nikmati setiap baris kode dan perbaikan bug-nya!",
            author: "- Semangat Belajar"
        },
        {
            text: "Jangan takut melihat pesan error, karena error adalah cara komputer mengajari kita.",
            author: "- Developer Mindset"
        }
    ];

    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const btnNewQuote = document.getElementById('btn-new-quote');

    let currentQuoteIndex = 0;

    if (btnNewQuote && quoteText && quoteAuthor) {
        btnNewQuote.addEventListener('click', () => {
            let nextIndex;
            // Pastikan kutipan berikutnya tidak sama dengan kutipan sekarang
            do {
                nextIndex = Math.floor(Math.random() * quotes.length);
            } while (nextIndex === currentQuoteIndex && quotes.length > 1);

            currentQuoteIndex = nextIndex;

            // Efek transisi teks yang halus
            quoteText.style.opacity = '0';
            quoteAuthor.style.opacity = '0';

            setTimeout(() => {
                quoteText.innerText = `"${quotes[currentQuoteIndex].text}"`;
                quoteAuthor.innerText = quotes[currentQuoteIndex].author;
                quoteText.style.opacity = '1';
                quoteAuthor.style.opacity = '1';
            }, 200);
        });
    }


    /* ==========================================================
       7. FITUR INTERAKTIF BADGE KEAHLIAN (SKILL BADGE TOOLTIP)
       ========================================================== */
    const skillDescriptions = {
        'HTML5': 'HTML5: Struktur dan kerangka utama halaman web.',
        'CSS3': 'CSS3: Mendesain gaya, warna, dan tampilan modern.',
        'Flexbox': 'Flexbox: Mengatur tata letak elemen secara responsif.',
        'JavaScript': 'JavaScript: Memberikan logika & interaktivitas dinamis.'
    };

    const skillBadges = document.querySelectorAll('.skills .badge-skill');
    skillBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            const skillName = badge.getAttribute('data-skill') || badge.innerText;
            const desc = skillDescriptions[skillName] || `Keahlian: ${skillName}`;
            showToast(`💡 ${desc}`);
        });
    });


    /* ==========================================================
       8. FUNGSI TOAST NOTIFIKASI
       ========================================================== */
    let toastTimeout;
    function showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.innerText = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
});
