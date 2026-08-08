/* eslint-disable */
/**
 * Generated Convex server utilities.
 */
import {
  ActionCtx as GenericActionCtx,
  MutationCtx as GenericMutationCtx,
  QueryCtx as GenericQueryCtx,
} from "convex/server";
import { DataModel } from "./dataModel";

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export type ActionCtx = GenericActionCtx<DataModel>;

export declare function query(func: { args?: any; handler: (ctx: QueryCtx, args: any) => any }): any;
export declare function mutation(func: { args?: any; handler: (ctx: MutationCtx, args: any) => any }): any;
export declare function action(func: { args?: any; handler: (ctx: ActionCtx, args: any) => any }): any;
