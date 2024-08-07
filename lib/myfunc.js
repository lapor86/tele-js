import https from 'https';
import fs from 'fs';
import Crypto from 'crypto';
import axios from 'axios';
import moment from 'moment-timezone';
import { sizeFormatter } from 'human-readable';
import util from 'util';
import Jimp from 'jimp';

const jsonFilePath = './db/custom_commands.json';

export const readCustomCommands = () => {
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export const saveCustomCommands = (commands) => {
  fs.writeFileSync(jsonFilePath, JSON.stringify(commands, null, 2), 'utf8');
}

export const handleCustomCommands = (groupID, command, reply) => {
  const customCommands = readCustomCommands();
  if (customCommands[groupID]) {
    const customResponse = customCommands[groupID][command.toUpperCase()];
    if (customResponse) {
      m.reply(customResponse);
    }
  }
}

export const addCustomCommand = (groupID, command, response) => {
  const customCommands = readCustomCommands();
  if (!customCommands[groupID]) {
    customCommands[groupID] = {};
  }
  customCommands[groupID][command] = response;
  saveCustomCommands(customCommands);
}



export const connect = (endPoint, postData) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return new Promise((resolve, reject) => {
    const req = https.request(endPoint, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(JSON.parse(data));
      });
    });
    req.on("error", (error) => {
      console.error("Error making API request:", error.message);
      reject(error);
    });
    req.write(JSON.stringify(postData)); // Send JSON payload
    req.end();
  });
};

export const generateUniqueRefID = () => {
      const tgl = moment.tz('Asia/Jakarta').format('DD')
      const wktu = moment(new Date()).format("HHmmss");
      return `JFx${tgl}${wktu}`;
    }


export const processTime = (timestamp, now) => {
	return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

export const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}