/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

export async function getMinehutIcons(): Promise<MinehutIcon[] | undefined> {
	const icons = await fetch("https://api.minehut.com/servers/icons");
	console.log(icons);
	if (!icons.ok) return undefined;
	return await icons.json();
}

export type MinehutIcon = {
	_id: string;
	display_name: string;
	icon_name: string;
	price: number;
	rank: string;
	available: boolean;
	disabled: boolean;
	created: number;
	last_updated: number;
	__v: number;
	salePrice: any;
};

export const rarityIndex = {
	common: { bg: "#40464d", text: "#b7bfc5" },
	uncommon: { bg: "#184f02", text: "#61bf01" },
	rare: { bg: "#15448a", text: "#41afff" },
	epic: { bg: "#4c1a7b", text: "#ce59ff" },
	legendary: { bg: "#de6e0d", text: "#fce8cf" },
};
