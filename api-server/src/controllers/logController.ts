import type { Context } from 'hono';
import { clickhouse } from '../services/index.js';
import { handleError } from '../utils/errorHandler.js';
import type { LogResponse } from '../types/index.js';

export const addLog = async (c: Context) => {
    try {
        const { deploymentId, isError, log } = await c.req.json();

        // const query = `INSERT INTO container_logs (project_id, deployment_id, is_error, log) VALUES ('${projectId}', '${deploymentId}',0, '${log}');`;
        const query = `INSERT INTO container_logs (deployment_id, is_error, log) VALUES ('${deploymentId}', ${isError ? 1 : 0}, '${log}');`;
        await clickhouse.command({ query });
        return c.json({ message: 'Log added successfully' }, 201);
    } catch (error) {
        return handleError(c, error);
    }
};

export const getLogs = async (c: Context) => {
    try {
        const { deploymentId } = c.req.query();
        // const query = `SELECT * FROM container_logs WHERE projectId = '${projectId}' AND deploymentId = '${deploymentId}'`;
        const query = `SELECT * FROM container_logs WHERE deployment_id = '${deploymentId}' ORDER BY created_at;`;
        const logs = await clickhouse.query({ query });
        const data = (await logs.json()).data as LogResponse[];
        // we convert is_error:number to boolean
        const manipulatedData = data.map(row => {
            row.is_error = row.is_error === 1 ? true : false
            return row;
        })
        return c.json({ data: manipulatedData });
    } catch (error) {
        return handleError(c, error);
    }
};