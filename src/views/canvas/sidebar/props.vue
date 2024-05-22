<template>
  <div class="props">
    <Title title="Props" />
    <div class="list">
      <div class="list-item" @click="getRedBook">
        <img src="@/assets/available-books.png" width="40px" />
      </div>
      <div class="list-item" @click="getHelmet">
        <img src="@/assets/helmet.png" width="40px" />
      </div>
    </div>
    <CheckBook ref="checkBookRef" @change="changeBookGroup" />
    <CheckHelmet ref="checkHelmetRef" @change="changeHelmetGroup" />
    <SelectGroup ref="selectGroupRef" @change="isSuccess" />
    <IsNftSuccess ref="isNftSuccessRef" />
    <AddToken ref="addTokenRef" @change="addSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CheckBook from "./checkBook.vue";
import CheckHelmet from "./checkHelmet.vue";
import SelectGroup from "./selectGroup.vue";
import IsNftSuccess from "./isNftSuccess.vue";
import AddToken from "./addToken.vue";
import { useAddressStore } from "@/store/address";
const Address = useAddressStore();
const emit = defineEmits(["change"]);

const checkBookRef = ref(null);
const getRedBook = () => {
  checkBookRef.value.open();
};

const checkHelmetRef = ref(null);
const getHelmet = () => {
  checkHelmetRef.value.open();
};

const selectGroupRef = ref(null);
const changeBookGroup = (inscriptionID) => {
  selectGroupRef.value.open(
    "book",
    inscriptionID,
    Address.getETHaddress,
    Address.getBTCaddress
  );
};
const changeHelmetGroup = (tokenID) => {
  selectGroupRef.value.open("helmet", tokenID, Address.getETHaddress);
};
const isNftSuccessRef = ref(null);
const isSuccess = (flag, tiker) => {
  isNftSuccessRef.value.open(flag, tiker);
  emit("change");
};

const addSuccess = (type) => {
  if (type === "success") {
    getTokenContract();
  }
};

onMounted(() => {});
</script>
<style scoped lang="scss">
.props {
  padding: 15px 22px 10px;
  border-bottom: 1px solid;
  border-image-source: linear-gradient(
    90deg,
    rgba(63, 63, 63, 0.3) 0%,
    rgba(255, 255, 255, 0.3) 46.5%,
    rgba(63, 63, 63, 0.3) 100%
  );
  border-image-slice: 1;
  .list {
    display: flex;
    justify-content: start;
    margin-top: 12px;
    .list-item {
      width: 88px;
      height: 68px;
      border: 1px solid;
      border-image-source: linear-gradient(180deg, #777e90 0%, #23252a 100%);
      border-image-slice: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
