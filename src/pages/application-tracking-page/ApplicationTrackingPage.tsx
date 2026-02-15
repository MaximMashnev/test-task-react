import { useParams } from "react-router-dom"

export default function ApplicationTrackingPage() {
    const params = useParams();

    return <div>ApplicationTrackingPage - {params.id}</div>
}