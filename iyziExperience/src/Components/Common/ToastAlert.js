import Swal from 'sweetalert2';

const ToastAlert = (title, icon, timer = 1500, position = 'bottom-end') => {
    if (timer === null)
        timer = 1500
    Swal.fire({
        toast: true,
        position: position,
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
    })
}

export default ToastAlert;