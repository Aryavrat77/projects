import { Button } from '~/components/ui/button';
import { api } from '~/utils/api'

export default function Test() {
    const { mutate } = api.user.userCreate.useMutation();
    // mutate({ name: "User1"})
    const { mutate: createLab } = api.lab.createLab.useMutation();
    //const { mutate: completeLab } = api.lab.markLabAsComplete.useMutation();
    // mutate({ name: "Lab1", userId: "1"});
    const { data } = api.user.getAllLabs.useQuery({ userId: "cluq2o78500002at9wsix6569" });
    // const { data: latestLab } = api.lab.getLatestLabByUserId.useQuery({ userId: "1" });
    //const { mutate: updateLab } = api.lab.updateLabProgress.useMutation();
    //const { mutate: deleteLab } = api.lab.deleteLab.useMutation();
    // console.log(data);
    // const handleClick = () => {
    //     createLab({ name: "new lab", userId: "1" });
    // }

    // const handleCompleteClick = () => {
    //     completeLab({ userId: "1", id: "1" });
    // }

    // const handleUpdateClick = () => {
    //     updateLab({ id: "1", userId: "1", progress: 40 });
    // }

    // const handleDeleteClick = () => {
    //     deleteLab({ id: "1", userId: "1" });
    // }

    //need to manage state
    return (
        <div className="relative">
            {/* <Button onClick={() => mutate({ name: "User1" })}>
                create a user
            </Button> */}
            <Button onClick={() => createLab({ name: "new lab", userId: "cluq2o78500002at9wsix6569" })}>
                create a lab    
            </Button>
            {/* <Button onClick={handleClick}>
                create a lab
            </Button>
            <Button onClick={handleCompleteClick}>
                mark lab as complete
            </Button>
            <Button onClick={handleUpdateClick}>
                update first lab
            </Button>
            <Button onClick={handleDeleteClick}>
                delete first lab
            </Button> */}
            <div>
                All Labs:
            </div>
            <ul>
                {data?.map((lab) => (
                    <li key={lab.id}>{lab.name}</li>
                ))}
            </ul>

            {/* <div>
                Newest addition: {latestLab?.name}
            </div> */}
        </div>
    )
}