const result = document.getElementById('result');

const status = document.getElementById('upload-status');
const imageList = document.getElementById('image-list');

document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('upload-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const images = formData.getAll('images'); 
        console.log(images);
        images.forEach(function(image, index) {
            const container = document.createElement('div'); 
            container.classList.add('progress-container');
            const progress = document.createElement('progress');
            progress.id = `progress-bar-${index}`;
            progress.value = 0;
            progress.max = 100;
            container.appendChild(progress);
            status.appendChild(container);
        
            upLoadImage(image, progress);
        });
        loadImages();
        
    });
});
function updateProgressBar(progressValue, progressElement) {
    progressElement.value = progressValue;
}
function upLoadImage(image,progressElement ) {
    const formData = new FormData();
    formData.append('images', image);
    fetch('/upload-images', {
        method: 'POST',
        body: formData,
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Lỗi tải lên: ' + response.status);
        }
      
        const contentLength = parseInt(response.headers.get('content-length'), 10);
        let loadedBytes = 0;

        const reader = response.body.getReader();

        function read() {
            reader.read().then(({ done, value }) => {
                if (done) {
                  
                } else {
                    loadedBytes += value.length;
                    const progress = (loadedBytes / contentLength) * 100;
                    updateProgressBar(progress, progressElement);
                    read(); 
                }
            });
        }

        read(); 
    }) .then(function(data) {
        
        progressElement.style.backgroundColor = 'green'; 
        showStatusMessage(progressElement, 'Success ' +image.name);
    })
    .catch(function(error) {

        progressElement.value = 0;
        progressElement.style.backgroundColor = 'red'; 
        showStatusMessage(progressElement,'Failed ' +image.name+ error.message); 
    });
}
function showStatusMessage(progressElement, message) {
    const statusMessage = document.createElement('span');
    statusMessage.textContent = message;
    progressElement.parentNode.appendChild(statusMessage); 
}
document.addEventListener('DOMContentLoaded', function() {
    loadImages();
    
});
function loadImages() {

    // Sử dụng fetch để lấy danh sách hình ảnh từ máy chủ
    fetch('/getImages')
        .then(response => response.json())
        .then(data => {
            // Xóa tất cả các phần tử con trong danh sách hình ảnh hiện tại
            while (imageList.firstChild) {
                imageList.removeChild(imageList.firstChild);
            }

            data.images.forEach(image => {
                const imageElement = document.createElement('div');
                imageElement.className = 'col-md-3';

                const img = document.createElement('img');
                img.src = `/uploads/${image}`;
                img.className = 'img-fluid';
                img.alt = image;

                imageElement.appendChild(img);
                imageList.appendChild(imageElement);
            });
        })
        .catch(error => {
            console.log(error);
        });
}
