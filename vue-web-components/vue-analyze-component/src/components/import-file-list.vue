 <template>
    <div class="import-file-list">
        <span class="import-file-list-header">已导入文件</span>
        <div class="import-file-cell-container">
            <import-file-cell v-for="(file,index) in lists" :key="index" :data="file" :selected="select === index" :index="index" @clickfile="clickfile" :stateList="stateList"></import-file-cell>
        </div>
    </div>
</template>

<script>
import importFileCell from './import-file-cell.vue'
export default {
    components: {
        importFileCell
    },
    props: {
        lists: Array,
        stateList: Array
    },
    data () {
        return {
            select: 0
        }
    },
    methods: {
        clickfile(data) {
            this.select = data.args.param.select
            this.$emit('clickfile', data)
        }
    }
}
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    @mixin heading-small {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #25232D;
        letter-spacing: 0.25px;
        text-align: left;
        line-height: 20px;
        font-weight: 400;
    }

    .import-file-list {
        display: flex;
        flex-direction: column;

        .import-file-list-header {
            @include heading-small;
            margin-bottom: 12px;
        }

        .import-file-cell-container {
            display: flex;
            flex-direction: column;
			overflow: auto;
    		height: calc(100vh - 220px);
            .import-file-cell {
                margin-bottom: 4px;

                &:last-of-type {
                    margin-bottom: 0;
                }
            }
        }
    }
</style>