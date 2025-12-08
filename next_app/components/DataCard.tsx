import { GeneratedAnswer } from "@/types/generate_answer";
import styles from "./DataCard.module.css";

interface DataCardProps {
    data: GeneratedAnswer;
    index: number;
}

export default function DataCard({ data }: DataCardProps) {
    return (
        <div className={styles['data-card']}>
            <div className={styles['data-card__key']}>
                <strong>Ключ:</strong> {data.keys?.join(', ') || 'N/A'}
            </div>
            <div className={styles['data-card__value']}>
                <strong>Значение:</strong> {data.values?.join(', ') || 'N/A'}
            </div>
        </div>
    );
}
