import Badge from "../../../components/ui/badge/Badge";
import { PurchaseStatus } from "../../../types";

interface PurchaseStatusBadgeProps {
    status: PurchaseStatus;
    size?: "sm" | "md";
}

const PurchaseStatusBadge: React.FC<PurchaseStatusBadgeProps> = ({
    status,
    size = "md",
}) => {
    const statusMap = {
        draft: { color: "warning" as const, label: "Draft" },
        ordered: { color: "info" as const, label: "Ordered" },
        received: { color: "success" as const, label: "Received" },
        cancelled: { color: "error" as const, label: "Cancelled" },
    };

    const { color, label } = statusMap[status];

    return (
        <Badge color={color} size={size} variant="light">
            {label}
        </Badge>
    );
};

export default PurchaseStatusBadge;