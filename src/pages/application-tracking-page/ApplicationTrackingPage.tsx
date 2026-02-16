import { useParams } from "react-router-dom"

export default function ApplicationsTrackingPage() {
    const params = useParams();

    return <div>ApplicationTrackingPage - {params.id}</div>
}