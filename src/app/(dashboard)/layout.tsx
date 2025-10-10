import { EditTaskModal } from "@/app/(dashboard)/(item)/_components/edit-item-modal";
import { Navbar } from "@/components/navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">
        <div className="mx-auto w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <EditTaskModal/>
            <Navbar />
            <main className="flex flex-col items-center justify-center pt-4 md:pt-14">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
