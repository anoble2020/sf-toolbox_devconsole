import { useSearchParams } from "next/navigation";

export default function getAllSearchParams() {
    const searchParams = useSearchParams();
    const params: { [anyProp: string]: string } = {};

    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
};