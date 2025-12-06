import Link from "next/link";
import styles from "./BackButton.module.css";

interface BackButtonProps {
    href: string;
    label?: string;
}

export default function BackButton({ href, label = "← Назад" }: BackButtonProps) {
    return (
        <Link href={href} className={styles['back-button']}>
            {label}
        </Link>
    );
}

