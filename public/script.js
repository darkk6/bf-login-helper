document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const clearBtn = document.getElementById('clearBtn');
    const generateBtn = document.getElementById('generateBtn');
    const output = document.getElementById('output');

    // 清除按鈕事件
    clearBtn.addEventListener('click', function() {
        urlInput.value = '';
        urlInput.focus();
    });

    // 生成按鈕事件
    generateBtn.addEventListener('click', async function() {
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
    function showSuccess(strEncryptBCDOData) {
        const iosLink = `beanfunweblogin://qrcode.login?key=${strEncryptBCDOData}`;
        const androidLink = `intent://qrcode.login?key=${strEncryptBCDOData}#Intent;scheme=beanfunweblogin;package=com.gamania.beanfun;end`;

        output.innerHTML = `
            <div class="success-message">
                <p>✓ 成功取得登入資訊</p>
                <div class="link-buttons">
                    <a href="${iosLink}" target="_blank" class="platform-link ios">iOS</a>
                    <a href="${androidLink}" target="_blank" class="platform-link android">Android</a>
                </div>
            </div>
        `;
    }

    // 支援 Enter 鍵觸發生成
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });
});
