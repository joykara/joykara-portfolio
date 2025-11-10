
interface TableProps {
    data: { headers: string[]; rows: string[][] }
}

export function Table({ data }: TableProps) {
    return (
        <table>
            <thead>
                <tr>{data.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
                {data.rows.map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => <td key={j}>{cell}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
