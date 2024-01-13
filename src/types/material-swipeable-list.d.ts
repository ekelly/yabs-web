import type { List } from "mui/material";

export declare module 'material-swipeable-list' {
	export type BaseItem = string | ({ _id?: string } & Record<string, unknown>) | { [key: string]: unknown };

	export type SwipeableListProps<Item extends BaseItem = BaseItem> = {
		maxAnimationCount?: number;
		maxSearchDepth?: number;
		dragBoundary?: number;
		component?: typeof List;
		style?: CSSProperties;
		onChange: (index: number) => void;
		items: Item[];
		generateKey?: (item: Item) => string;
	} & (
		| {
				children: GenerateListItem<Item>;
				generateListItem?: GenerateListItem<Item>;
		}
		| { generateListItem: GenerateListItem<Item>; children?: undefined }
	);

	export function SwipeableList<Item extends BaseItem = BaseItem>(props: SwipeableListProps<Item>): List;

	export default SwipeableList;
}
