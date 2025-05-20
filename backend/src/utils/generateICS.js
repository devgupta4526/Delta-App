// utils/generateICS.js
import { writeFileSync } from "fs";
import { createEvent } from "ics";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const generateICSFile = async ({ title, description, location, startDateTime, durationInMinutes }) => {
    const event = {
        start: [
            startDateTime.getFullYear(),
            startDateTime.getMonth() + 1,
            startDateTime.getDate(),
            startDateTime.getHours(),
            startDateTime.getMinutes()
        ],
        duration: { minutes: durationInMinutes || 60 },
        title: title || "PoolConnect Event",
        description: description || "You’ve joined a new pool event!",
        location: location || "Online or to be decided",
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        organizer: { name: "PoolConnect", email: "no-reply@poolconnect.com" },
    };

    return new Promise((resolve, reject) => {
        createEvent(event, (error, value) => {
            if (error) return reject(error);

            const filename = `event-${uuidv4()}.ics`;
            const filePath = path.join("/tmp", filename); // safe write path
            writeFileSync(filePath, value);
            resolve({ filename, filePath });
        });
    });
};
