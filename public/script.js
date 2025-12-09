document.addEventListener('DOMContentLoaded', function () {
    const urlInput = document.getElementById('urlInput');
    const clearBtn = document.getElementById('clearBtn');
    const generateBtn = document.getElementById('generateBtn');
    const output = document.getElementById('output');

    // 檢查 URL 參數中是否有 strEncryptBCDOData（保留原始 URL 編碼）
    const searchParams = window.location.search;
    const match = searchParams.match(/[?&]strEncryptBCDOData=([^&]*)/);

    if (match && match[1]) {
        // 直接觸發 showSuccess，保留原始 URL 編碼形式（不進行 decode）
        showSuccess(match[1], true);
    }

    // 清除按鈕事件
    clearBtn.addEventListener('click', function () {
        urlInput.value = '';
        urlInput.focus();
    });

    // 生成按鈕事件
    generateBtn.addEventListener('click', async function () {
        const input = urlInput.value.trim();

        // 清空輸出區
        output.innerHTML = '';

        if (!input) {
            showError('請輸入網址或 skey');
            return;
        }

        // 步驟 1 & 2: 判斷是網址還是 skey
        let skey;
        if (isUrl(input)) {
            // 是網址，嘗試提取 skey
            skey = extractSkey(input);
            if (!skey) {
                showError('網址中找不到 skey');
                return;
            }
        } else {
            // 不是網址，直接視為 skey
            skey = input;
        }

        // 步驟 3: 發送 GET request 到我們的後端 API
        try {
            const apiUrl = `/api/qrcode?skey=${encodeURIComponent(skey)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // 檢查是否有 strEncryptBCDOData 欄位且不為空
            if (!data.strEncryptBCDOData || data.strEncryptBCDOData.trim() === '') {
                showError('無法取得登入資訊，可能已經過期或錯誤的網址/skey');
                return;
            }

            // 步驟 4: 顯示成功結果
            showSuccess(data.strEncryptBCDOData);

        } catch (error) {
            console.error('Error:', error);
            showError('無法取得登入資訊');
        }
    });

    // 判斷是否為有效的 URL
    function isUrl(input) {
        // 需要同時滿足兩個條件：
        // 1. 以 http:// 或 https:// 開頭
        // 2. 包含 tw.newlogin.beanfun.com
        const hasProtocol = input.startsWith('http://') || input.startsWith('https://');
        const hasValidDomain = input.includes('tw.newlogin.beanfun.com');
        return hasProtocol && hasValidDomain;
    }

    // 從網址中提取 skey 參數
    function extractSkey(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('skey');
        } catch (e) {
            return null;
        }
    }

    // 顯示錯誤訊息
    function showError(message) {
        output.innerHTML = `<div class="error-message">${message}</div>`;
    }

    // 顯示成功結果
    function showSuccess(strEncryptBCDOData, autoRedirect) {
        const iosLink = `beanfunweblogin://qrcode.login?key=${strEncryptBCDOData}`;
        const androidLink = `intent://qrcode.login?key=${strEncryptBCDOData}#Intent;scheme=beanfunweblogin;package=com.gamania.beanfun;end`;
        autoRedirect = autoRedirect || false;

        output.innerHTML = `
            <div class="success-message">
                <p>✓ 成功取得登入資訊</p>
                <div class="link-buttons">
                    <a href="${iosLink}" target="_blank" class="platform-link ios">iOS</a>
                    <a href="${androidLink}" target="_blank" class="platform-link android">Android</a>
                </div>
            </div>
        `;

        if (autoRedirect === true) {
            // 根據平台自動觸發相應的連結
            const userAgent = navigator.userAgent.toLowerCase();
            let platformLink = null;

            if (/iphone|ipad|ipod/.test(userAgent)) {
                // iOS 平台
                platformLink = iosLink;
            } else if (/android/.test(userAgent)) {
                // Android 平台
                platformLink = androidLink;
            }

            if (platformLink) {
                // 延遲 500ms 後觸發，確保 DOM 已更新
                setTimeout(() => {
                    window.location.href = platformLink;
                }, 500);
            }
        }
    }

    // 支援 Enter 鍵觸發生成
    urlInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });
});
