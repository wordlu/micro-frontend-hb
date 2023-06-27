<template>
    <div class="table-cell-border" 
        :class="[
            project.jobDesc ? 'border-' + project.jobDesc : 'button-default',
        ]">
        <span>{{project.showName}}</span>
        <div class='button-container'>
            <div class='button-background-grey' @click="this.clickButton">
                <button class='icon_QC'></button>
            </div>
            <div class='button-background-purple' @click="this.clickButton">
                <button :class="'icon_'+type"></button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: "upload"
        },
        value: String,
        date: String,
        project: Object,
        index: Number,
        provider: String,
        projectId: String
    },
    methods: {
        clickButton() {
            const event = new Event("event")
            event.args = {
                callback: "opt",
                element: this,
                param: {
                    type: this.type,
                    name: this.value,
                    date: this.date,
                    project: this.project,
                    provider: this.provider,
                    projectId: this.projectId
                }
            }
            this.$emit('tableClickEvent', event)
        }
    }
}
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    @mixin body-primary {
        font-family: PingFangSC-Light;
        font-size: 14px;
        color: #25232D;
        letter-spacing: 0.25px;
        line-height: 20px;
        font-weight: 200;
    }

    button {
        border: 0;
        padding: 0;
        cursor: pointer;
    }

    .icon_QC {
        width: 12.5px;
        height: 12.5px;
        background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.81 14.5l.776-.693c-.288-.425-.587-.827-.875-1.219.642-.76.963-1.733.963-2.929 0-1.23-.332-2.225-.996-2.974C7.98 5.891 7.028 5.5 5.832 5.5c-1.207 0-2.16.391-2.846 1.196C2.32 7.456 2 8.44 2 9.66c0 1.207.321 2.191.986 2.952.686.782 1.639 1.185 2.846 1.185.82 0 1.517-.18 2.104-.537.288.391.575.805.874 1.241zm-2.978-1.778c-.842 0-1.495-.29-1.96-.85-.443-.547-.665-1.285-.665-2.213 0-.94.222-1.677.664-2.225.466-.581 1.119-.86 1.96-.86.842 0 1.496.268 1.95.827.443.547.675 1.297.675 2.258 0 .816-.166 1.476-.498 1.99a36.69 36.69 0 0 0-1.196-1.353l-.698.693c.388.414.786.872 1.185 1.376-.388.234-.864.357-1.417.357zm8.735 1.074c.853 0 1.584-.246 2.193-.738.653-.526 1.063-1.252 1.24-2.18h-1.174c-.155.626-.432 1.095-.83 1.408-.377.291-.864.436-1.44.436-.886 0-1.54-.28-1.96-.838-.399-.526-.598-1.264-.598-2.225 0-.928.2-1.666.609-2.202.432-.593 1.074-.884 1.927-.884.576 0 1.04.123 1.417.38.377.258.632.66.764 1.197h1.174c-.122-.805-.476-1.454-1.052-1.923-.598-.492-1.362-.727-2.281-.727-1.262 0-2.215.414-2.88 1.263-.597.75-.885 1.71-.885 2.896 0 1.207.277 2.169.853 2.884.653.828 1.627 1.253 2.923 1.253z' fill='%2357565F' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat center/100% !important; 
    }

    .icon_calculation {
        width: 12.5px;
        height: 12.5px;
        background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 3c3.435 0 6.293.802 6.887 2.098H17v10.295C17 16.988 13.88 18 10 18c-3.778 0-6.835-.96-6.994-2.482L3 15.393V5.097h.113C3.707 3.803 6.565 3 10 3zm3.121 9.863l-.523.079c-.803.108-1.679.165-2.598.165-.92 0-1.795-.057-2.598-.165l-.523-.08c-1.168-.197-2.148-.51-2.831-.919v3.45c0 .73 2.647 1.588 5.952 1.588 3.205 0 5.79-.807 5.944-1.52l.008-.068v-3.45c-.683.409-1.663.722-2.83.92zM4.048 10.5c0 .73 2.647 1.588 5.952 1.588 3.205 0 5.79-.807 5.944-1.521l.008-.067V7.046c-1.235.738-3.44 1.167-5.952 1.167-2.513 0-4.717-.43-5.952-1.167V10.5zM10 4.019c-.498 0-.982.02-1.445.056l-.544.05c-2.31.253-3.963.91-3.963 1.482 0 .285.414.592 1.116.86l.344.12c1.09.35 2.698.607 4.492.607s3.401-.256 4.492-.607l.344-.12c.702-.268 1.116-.575 1.116-.86 0-.572-1.654-1.229-3.963-1.481l-.544-.051A18.587 18.587 0 0 0 10 4.019z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat center/100% !important; 
    }

    .icon_import {
        width: 12.5px;
        height: 12.5px;
        background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 3v6h-1V8H3V7h14V4H2.991L2.99 16.975l5.945.05v1.025L1.998 18 2 3h16zm-3.856 7.144L18 14l-3.985 3.985-.701-.701 2.783-2.784H9.56v-1.025h6.466l-2.606-2.606.724-.725z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat center/100% !important; 
    }

    .icon_report {
        width: 12.5px;
        height: 12.5px;
        background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 2a1 1 0 0 1 1 1v11l-4.083 4H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h12zm0 1H4v14h8.507L16 13.579V3zm-6 6v1H6V9h4zm4-3v1H6V6h8z' fill='%23FFFFFF' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat center/100% !important; 
    }

    .icon_clean {
        width: 12.5px;
        height: 12.5px;
        background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.973 2.802c3.46.986 5.754 4.192 5.51 7.708-.246 3.515-2.962 6.386-6.526 6.907-3.475.508-6.849-1.351-8.21-4.494l-.098-.238-.182-.466.93-.365.183.465c1.12 2.85 4.127 4.562 7.232 4.108 3.103-.453 5.46-2.945 5.673-5.987.212-3.04-1.777-5.818-4.786-6.677-2.93-.835-6.055.37-7.61 2.898l-.129.22-.245.436-.215-.12v.506h-1v-5.2h1V5.74c1.862-2.637 5.27-3.85 8.473-2.937zM11 5.5v4.308l2.916 1.459-.447.894L10 10.427V5.5h1z' fill='%23FFFFFF' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat center/100% !important; 
    }

    .icon_upload {
        width: 12.5px;
        height: 12.5px;
        background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Cpath d='M15.538 10c.227 0 .415.177.455.41l.007.09V16H4v-5.5c0-.276.207-.5.462-.5.226 0 .415.177.454.41l.007.09V15h10.154v-4.5a.49.49 0 0 1 .378-.492l.083-.008zm-5.495-6l.07.01.094.029.103.056.048.039 4 3.682.057.063c.132.177.11.42-.065.574a.543.543 0 0 1-.618.058l-.09-.065L10.5 5.552l.001 6.998-.008.08c-.042.21-.247.37-.492.37-.237 0-.435-.148-.487-.347L9.5 12.55l-.001-6.996-3.141 2.892-.07.052a.543.543 0 0 1-.638-.045.417.417 0 0 1-.078-.555l.07-.082 4-3.682.07-.053.066-.036.09-.03L9.957 4h.086z' id='a'/%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3Cuse fill='%23FFF' xlink:href='%23a'/%3E%3C/g%3E%3C/svg%3E") no-repeat center/100% !important; 
    }
    .border-failed {
        border: 1px solid red ;
    }
    .border-success {
        border: 1px solid green;
    }
    .border-running {
        border: 1px solid #7163C5;
    }
    .border-FAILED {
        border: 1px solid red ;
    }
    .border-ABORTED {
        border: 1px solid red ;
    }
    .border-TIMED_OUT {
        border: 1px solid red ;
    }
    .border-SUCCEEDED {
        border: 1px solid green;
    }
    .border-RUNNING {
        border: 1px solid #7163C5;
    }
    .button-default {
        border: 1px solid #E1DFE9;
    }
    .table-cell-border {
        // width: 209px;
        height: 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        @include body-primary;
        
        .button-container {
            display: flex;

            .button-background-grey {
                width: 20px;
                height: 20px;
                background: rgba(37, 35, 45, 0.04);
                border-radius: 1.25px;
                margin-right: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .button-background-purple {
                width: 20px;
                height: 20px;
                background: #7163C5;
                border-radius: 1.25px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>