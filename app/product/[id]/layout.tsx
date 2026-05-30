import Footer from "@/components/Footer";
import Header from "@/components/Header";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen justify-between">
            <Header />
            {children}
            <Footer />
        </div>
    );
}

export default layout;