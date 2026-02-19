import Header from "@/components/Header";
import Image from 'next/image';
import logo from '../../../public/Logo.png';

export default function DashboardPage() {
  return (
    <div>
        <Header />
        <div className="glass">
            <Image
                src={logo}
                alt='Unique Logo'
                width={50}
                height={50}
            />
        </div>
    </div>
  );
}