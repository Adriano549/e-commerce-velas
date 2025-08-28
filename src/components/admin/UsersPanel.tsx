import { getUsers } from "@/services/usersService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";




export default async function AdminUsersPage() {
    const users = await getUsers();
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Gerir Usuários</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Admin</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.admin ? "Sim" : "Não"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}