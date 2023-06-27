export const PhJoinDefs = {
    actions: [
        {
            avatar: "",
            desc: "左连接",
            cal: "LEFT"
        },
        {
            avatar: "",
            desc: "右连接",
            cal: "RIGHT"
        },
        {
            avatar: "",
            desc: "内连接",
            cal: "INNER"
        },
        {
            avatar: "",
            desc: "笛卡尔积",
            cal: "CROSS"
        }
    ],
    conditions: [
        {
            desc: "=",
            cal: "="
        }
    ],
    pattern: [
        {
            desc: "符合所有条件进行匹配",
            cal: "AND"
        },
		{
			desc: "符合任意条件进行匹配",
			cal: "OR"
		}
    ]

}
