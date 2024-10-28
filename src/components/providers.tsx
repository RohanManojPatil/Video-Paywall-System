"use Client";
import {QueryProvider} from './providers/query_provider'
interface ProviderProps {
    children : React.ReactNode;
}

export function Providers({children} : ProviderProps) {
    return <QueryProvider>{children}</QueryProvider>;
}