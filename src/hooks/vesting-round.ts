import React, { useEffect, useState } from 'react';
import { json } from 'stream/consumers';
import axios from 'axios';
import { Buffer } from 'buffer';

const PUBLICNODE = 'https://terra-classic-lcd.publicnode.com';

export enum VestingRoundName {
    LOCKDROP = 'lockdrop',
    INVESTORS = 'investors',
    SHIRINI = 'shirini',
}

type QueryWeightsElement = {
    address: string;
    weight: number;
};


export type SelectedVestingRoundState = {
    roundName: VestingRoundName;
    weights: QueryWeightsElement[];
};

const VestingContracts = new Map<VestingRoundName, string>([
    [VestingRoundName.LOCKDROP, 'terra1fdqhjvsumljna8rehljqwx3rgx4tej762fret70zvm0dhyhhz3wst2z463'],
    [VestingRoundName.INVESTORS, 'terra1xlk47w09qye4emj3zmuwp5m65gxjf6sacxpd9tr3xyt59a0cstpqesshuk'],
    [VestingRoundName.SHIRINI, '<TBD>'],
]);

const DmzContracts = new Map<VestingRoundName, string>([
    [VestingRoundName.LOCKDROP, 'terra1pfefmmls2w67njucd2qgvv4qefcutyl95g986pd69caxdyzp7acsfp0fv8'],
    [VestingRoundName.INVESTORS, 'terra1cjjy4yzzp6sdv6uq27u6l82gslpdkw4l3zk785674mh8gk9dn5qqvr4nr0'],
    [VestingRoundName.SHIRINI, '<TBD>'],
]);

const buildQuery = (obj: any, contract: string) => {
    const jsonObj = JSON.stringify(obj);
    const base64 = Buffer.from(jsonObj).toString('base64');
    const url = `${PUBLICNODE}/cosmwasm/wasm/v1/contract/${contract}/smart/${base64}`;
    return url;
}

// get the lockdrop distribution weights (all of them)
// round: either 'lockdrop', 'shirini' or 'investors'
const getWeights = async function (round = VestingRoundName.LOCKDROP): Promise<QueryWeightsElement[]> {
    const contract = DmzContracts.get(round);
    if (!contract) {
        return [];
    }
    const query = buildQuery({ weights: {} }, contract);
    try {
        const response = await axios.get(query);
        const responseData = response.data.data;
        return responseData.map((data: any) => {
            const elem: QueryWeightsElement = {
                address: data[0],
                weight: parseFloat(data[1]),
            }
            console.log(elem)
            return elem;
        });
    } catch (err) {
        console.log('Could not Fetch weights')
        console.log(err)
        return [];
    }

}

const getTotalVest = async function (round = VestingRoundName.LOCKDROP): Promise<number> {
    const contract = VestingContracts.get(round);
    if (!contract) {
        return 0;
    }
    const query = buildQuery({ total_to_vest: {} }, contract);
    try {
        const response = await axios.get(query);
        const responseData = response.data.data;
        return parseFloat(responseData);
    } catch (err) {
        console.log('Could not Fetch total vest')
        console.log(err)
        return 0;
    }
}

export const useVestingRound = () => {
    const [roundName, setRoundName] = useState(VestingRoundName.LOCKDROP);
    const [weights, setWeights] = useState<QueryWeightsElement[]>([]);
    const [totalVest, setTotalVest] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedWeights = await getWeights(roundName);
            if (fetchedWeights !== weights) setWeights(fetchedWeights);

            const fetchedTotalVest = await getTotalVest(roundName);
            if (fetchedTotalVest !== totalVest)  setTotalVest(fetchedTotalVest);
        }

        fetchData();
    }, [roundName, totalVest]);
    
    // eslint-disable-next-line
    return {round: roundName, setRound: setRoundName, weights: weights, total: totalVest};
};