export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>){
     return (
          <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-backgroundg p-3">
               {children}
          </div>
     )
}