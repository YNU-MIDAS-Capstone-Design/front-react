import Header from "./Header"
import Footer from "./Footer"
import styles from "./Template.module.css"

const Template = ({ children }) => {
    return (
        <>
            <div className={styles.wrapper}>
                <main>
                    <Header/>
                    {children}
                    <Footer/>
                </main>
            </div>
        </>
    )
}

export default Template