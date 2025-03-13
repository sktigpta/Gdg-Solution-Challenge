import React from "react";
import "./Dashboard.css";
import FetchedVideos from "../../components/fetched-videos/FetchedVideos";
import { ContainerTwo } from "../../components/cards-and-containers/Container";
import Query from "../../components/query/query";
import PermittedVideos from "../../components/permitted-channel/permittedChannel";

function Dashboard() {
    return (
        <>
            <div className="dashboard">
                <ContainerTwo >
                    <Query />
                    <FetchedVideos />
                    <PermittedVideos />
                </ContainerTwo>
            </div>
        </>
    );
}

export default Dashboard;
