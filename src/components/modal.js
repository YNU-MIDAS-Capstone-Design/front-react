import styles from "./modal.module.css"

function Modal({isOpen}){
    if (isOpen==-1) return null;
    return(
        <div className={`${styles.modalBox} ${!isOpen ? styles.modalclose : styles.modalopen}`}>
            
        </div>
    );
}
export default Modal;