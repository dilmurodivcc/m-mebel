import ClientLayout from "@/components/layout/ClientLayout";

export default function Loading() {
  return (
    <ClientLayout showFooter={false} showHeader={false} >
      <div className="base-loading">
        <span className="loader"></span>
      </div>
    </ClientLayout>
  );
}
